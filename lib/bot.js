'use strict';

const Botkit = require('botkit');
const logger = require('./logger')();

/**
 * @module Bot
 */
class Bot {
  /**
   * Constructor.
   *
   * @constructor
   * @param {object} config The final configuration for the bot
   */
  constructor(config) {
    this.config = config;
    this.controller = Botkit.slackbot();

    this.responded = new Map();
    this.lookup = new Map();

    this.autoMarkJob = null;
    this.autoMarkChannels = new Map();
  }

  /**
   * Mark any queued channels as read.
   *
   * @return {Bot} returns itself
   */
  markChannels() {
    this.autoMarkChannels.forEach((ts, channelId) => {
      const channel = this.lookup.get(channelId) || { name: channelId };

      logger.info(`Marking: ${channel.name}`);
      this.bot.api.channels.mark({ channel: channelId, ts }, (error) => {
        if (error) {
          logger.error(`Error while marking ${channelId}: ${error}`);
        } else {
          this.autoMarkChannels.delete(channelId);
        }
      });
    });
  }

  /**
   * Populates a quick lookup table.
   *
   * @param {object} payload The rtm.start payload
   * @return {Bot} returns itself
   */
  populateLookup(payload) {
    ['users', 'channels', 'groups', 'mpims'].forEach((type) => {
      if (payload[type]) {
        payload[type].forEach((item) => {
          this.lookup.set(item.id, item);
        });
      }
    });
  }

  /**
   * Function to be called on slack open
   *
   * @param {object} payload Connection payload
   * @return {Bot} returns itself
   */
  slackOpen(payload) {
    const channels = [];
    const groups = [];
    const mpims = [];

    logger.info(`Welcome to Slack. You are @${payload.self.name} of ${payload.team.name}`);

    if (payload.channels) {
      payload.channels.forEach((channel) => {
        if (channel.is_member) {
          channels.push(`#${channel.name}`);
        }
      });

      logger.info(`You are in: ${channels.join(', ')}`);
    }

    if (payload.groups) {
      payload.groups.forEach((group) => {
        groups.push(`${group.name}`);
      });

      logger.info(`Groups: ${groups.join(', ')}`);
    }

    if (payload.mpims) {
      payload.mpims.forEach((mpim) => {
        mpims.push(`${mpim.name}`);
      });

      logger.info(`Multi-person IMs: ${mpims.join(', ')}`);
    }

    return this;
  }

  /**
   * Handle an incoming message
   * @param {object} message The incoming message from Slack
   * @return {Bot} returns itself
   */
  handleMessage(message) {
    const channel = this.lookup.get(message.channel);
    const user = this.lookup.get(message.user);
    const userName = (user && user.name) ? `@${user.name}` : 'UNKNOWN_USER';

    let response = '';
    let channelName = (channel && channel.is_channel) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');

    if (userName === `@${this.bot.identity.name}`) {
      // ignore your own messages, also you are supposed to be OoO!
    } else if (message.type === 'message' && (message.text) && (message.channel !== null)) {
      // Channel is a direct message
      if ((message.event === 'direct_message') && this.config.app.respond.dm) {
        if ((this.responded.get(message.channel) || 0) < Date.now()) {
          logger.info(`${userName} sent DM: ${message.text}`);
          response = `${this.config.app.response.dmprefix.replace('${user}', userName)}${this.config.app.message}`;
          this.bot.reply(message, response);
          logger.info(`@${this.bot.identity.name} responded to ${userName} with "${response}"`);
          this.responded.set(message.channel, Date.now() + this.config.app.reminder * 60000);
        }
      } else if (this.config.app.respond.channel) {
        if ((this.responded.get(message.channel) || 0) < Date.now()) {
          response = `${this.config.app.response.channelprefix.replace('${channel}', channelName)}${this.config.app.message}`;
          this.bot.reply(message, response);
          logger.info(`@${this.bot.identity.name} responded on ${channelName} with "${response}"`);
          this.responded.set(message.channel, Date.now() + this.config.app.reminder * 60000);
        } else {
          logger.info(`Already responded on ${channelName}. Ignoring message.`);
        }
      }
    } else {
      const typeError = message.type !== 'message' ? `Unexpected type: ${message.type}` : null;
      const textError = !message.text ? 'text was undefined' : null;
      const channelError = channel === null ? 'channel was undefined.' : null;
      const errors = [typeError, textError, channelError].filter((element) => {
        return element !== null;
      }).join(' ');
      logger.info(`@${this.bot.identity.name} could not respond. ${errors}`);
    }

    return this;
  }

  /**
   * Start the bot
   *
   * @return {Bot} returns itself
   */
  start() {
    this.controller.on('team_join,user_change,bot_group_join,bot_channel_join', (bot, message) => {
      if (message.user && message.user.id) {
        this.lookup.set(message.user.id, message.user);
      } else if (message.channel && message.channel.id) {
        this.lookup.set(message.channel.id, message.channel);
      }
    });

    this.controller.on('direct_message,direct_mention,mention', (bot, message) => {
      this.handleMessage(message);
    });

    this.controller.on('rtm_close', () => {
      logger.info('The RTM api just closed');

      if (this.config.slack.autoReconnect) {
        this.connect();
      }
    });

    this.connect();

    return this;
  }

  /**
   * Connect to the RTM
   * @return {Bot} this
   */
  connect() {
    this.bot = this.controller.spawn({
      token: this.config.slack.token,
      no_unreads: true,
      mpim_aware: true,
    }).startRTM((err, bot, payload) => {
      if (err) {
        logger.error('Error starting bot!', err);
      }

      this.payload = payload;
      this.populateLookup(payload);
      this.slackOpen(payload);

      if (this.config.slack.autoMark) {
        if (this.autoMarkJob) {
          logger.info('Stopping auto mark job');
          clearInterval(this.autoMarkJob);
          this.autoMarkJob = null;
        }

        logger.info('Starting auto mark job');
        this.autoMarkJob = setInterval(() => {
          this.markChannels();
        }, 5000);

        this.controller.on('ambient', (botAgain, message) => {
          if (message && message.channel && message.ts) {
            this.autoMarkChannels.set(message.channel, message.ts);
          }
        });
      }
    });

    return this;
  }

  /**
   * Stop the bot
   *
   * @return {Bot} returns itself
   */
  stop() {
    this.bot.closeRTM();
    if (this.autoMarkJob) {
      logger.info('Stopping auto mark job');
      clearInterval(this.autoMarkJob);
      this.autoMarkJob = null;
    }

    return this;
  }
}

module.exports = Bot;
