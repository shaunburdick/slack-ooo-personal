'use strict';

const logger = require('./lib/logger')();
const redact = require('redact-object');
const Bot = require('./lib/bot');

/**
 * Load config
 */
const config = (() => {
  let retVal;
  try {
    retVal = require('./config');
  } catch (exception) {
    retVal = require('./config.default');
  }

  return retVal;
})();

let bot;

/**
 * Pull config from ENV if set
 */
config.app.message = process.env.APP_MESSAGE || config.app.message;
config.app.reminder = process.env.APP_REMINDER || config.app.reminder;
config.app.respond.dm = process.env.APP_RESPOND_DM || config.app.respond.dm;
config.app.respond.channel = process.env.APP_RESPOND_CHANNEL || config.app.respond.channel;
config.app.timebox.start = process.env.APP_TIMEBOX_START || config.app.timebox.start;
config.app.timebox.end = process.env.APP_TIMEBOX_END || config.app.timebox.end;

config.slack.token = process.env.SLACK_TOKEN || config.slack.token;
config.slack.autoReconnect = process.env.SLACK_AUTO_RECONNECT || config.slack.autoReconnect;
config.slack.autoMark = process.env.SLACK_AUTO_MARK || config.slack.autoMark;

logger.info('Using the following configuration:', redact(config, ['token']));

function end() {
  logger.info('Ending out of office...');
  if (bot instanceof Bot) {
    bot.stop();
  }
  process.exit();
}

function start() {
  logger.info('Starting bot...');
  bot = new Bot(config);
  setTimeout(() => { bot.start(); }, 1000);

  // Set a clock to turn off
  const rightnow = Date.now();
  if (config.app.timebox.end > rightnow) {
    const endDate = new Date(config.app.timebox.end);
    logger.info(`Waiting until ${endDate} for end time...`);
    setTimeout(end, config.app.timebox.end - rightnow);
  }
}

// Check if then end is later than now or not set (no end in sight)
const now = Date.now();
if (config.app.timebox.end > now || !config.app.timebox.end) {
  // Check if we are past the start time
  if (config.app.timebox.start < now) {
    start();
  } else {
    const startDate = new Date(config.app.timebox.start);
    logger.info(`Waiting until ${startDate} to start bot...`);
    setTimeout(start, config.app.timebox.start - now);
  }
} else {
  logger.error(`Cannot start with historical end time: ${new Date(config.app.timebox.end)}`);
}
