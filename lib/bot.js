'use strict';

const Slack = require('slack-client');
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
    this.slack = new Slack(config.slack.token, config.slack.autoReconnect, config.slack.autoMark);

    this.responded = {};
  }

  /**
   * Function to be called on slack open
   *
   * @return {Bot} returns itself
   */
  slackOpen() {
    const unreads = this.slack.getUnreadCount();
    const channels = [];
    const allChannels = this.slack.channels;
    const allGroups = this.slack.groups;
    const messages = unreads === 1 ? 'message' : 'messages';

    let id;
    const groups = [];
    for (id in allChannels) {
      if (allChannels[id].is_member) {
        channels.push(`#${allChannels[id].name}`);
      }
    }
    for (id in allGroups) {
      if (allGroups[id].is_open && !allGroups[id].is_archived) {
        groups.push(allGroups[id].name);
      }
    }

    logger.info(`Welcome to Slack. You are @${this.slack.self.name} of ${this.slack.team.name}`);
    logger.info(`You are in: ${channels.join(', ')}`);
    logger.info(`As well as: ${groups.join(', ')}`);
    logger.info(`You have ${unreads} unread ${messages}`);

    return this;
  }

  /**
   * Handle an incoming message
   * @param {object} message The incoming message from Slack
   * @return {Bot} returns itself
   */
  handleMessage(message) {
    const channel = this.slack.getChannelGroupOrDMByID(message.channel);
    const user = this.slack.getUserByID(message.user);
    const userName = (user && user.name) ? `@${user.name}` : 'UNKNOWN_USER';

    let response = '';
    let channelName = (channel && channel.is_channel) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');

    if (userName === `@${this.slack.self.name}`) {
      // ignore your own messages, also you are supposed to be OoO!
    } else if (message.type === 'message' && (message.text !== null) && (channel !== null)) {
      // Channel is a direct message
      if (channel.is_im && this.config.app.respond.dm) {
        logger.info(`${userName} sent DM: ${message.text}`);
        if (!this.responded.hasOwnProperty(userName) ||
          this.responded[userName] < Date.now()
        ) {
          response = `Hello ${userName}. I'm currently out of the office with message:\n\n${this.config.app.message}`;
          channel.send(response);
          logger.info(`@${this.slack.self.name} responded to ${userName} with "${response}"`);
          this.responded[userName] = Date.now() + this.config.app.reminder;
        } else {
          logger.info(`Already responded to ${userName}. Ignoring message.`);
        }
      } else if (this.config.app.respond.channel) {
        // Search message for user mentions
        const matches = message.text.match(/@\w+/g);
        const translatedUsers = [];
        if (matches) {
          // Need to translate user id to username
          let matchedUser;
          matches.forEach((match) => {
            matchedUser = this.slack.getUserByID(match.replace('@', ''));
            if (matchedUser) {
              translatedUsers.push(`@${matchedUser.name}`);
            }
          });

          if (translatedUsers &&
            translatedUsers.indexOf(`@${this.slack.self.name}`) !== -1
          ) {
            if (!this.responded.hasOwnProperty(channelName) ||
              this.responded[channelName] < Date.now()
            ) {
              response = `Hello ${channelName}. I'm currently out of the office with message:\n\n${this.config.app.message}`;
              channel.send(response);
              logger.info(`@${this.slack.self.name} responded on ${channelName} with "${response}"`);
              this.responded[channelName] = Date.now() + this.config.app.reminder;
            } else {
              logger.info(`Already responded on ${channelName}. Ignoring message.`);
            }
          }
        }
      }
    } else {
      const typeError = message.type !== 'message' ? `Unexpected type: ${message.type}` : null;
      const textError = message.text === null ? 'text was undefined' : null;
      const channelError = channel === null ? 'channel was undefined.' : null;
      const errors = [typeError, textError, channelError].filter((element) => {
        return element !== null;
      }).join(' ');
      logger.info(`@${this.slack.self.name} could not respond. ${errors}`);
    }

    return this;
  }

  /**
   * Start the bot
   *
   * @return {Bot} returns itself
   */
  start() {
    this.slack.on('open', () => {
      this.slackOpen();
    });

    this.slack.on('message', (message) => {
      this.handleMessage(message);
    });

    this.slack.on('error', (error) => {
      logger.error('Error: %s', error);
    });

    this.slack.login();

    return this;
  }

  /**
   * Stop the bot
   *
   * @return {Bot} returns itself
   */
  stop() {
    this.slack.disconnect();

    return this;
  }
}

module.exports = Bot;
