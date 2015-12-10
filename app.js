'use strict';

const logger = require('./lib/logger')();
const redact = require('redact-object');
const Bot = require('./lib/bot');
const Config = require('./lib/config');

let bot;
let config;

/**
 * Load config
 */
const rawConfig = (() => {
  let retVal;
  try {
    retVal = require('./config');
  } catch (exception) {
    retVal = require('./config.default');
  }

  return retVal;
})();

try {
  config = Config.parse(rawConfig);
} catch (error) {
  logger.error('Could not parse config', error);
  process.exit(1);
}

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
