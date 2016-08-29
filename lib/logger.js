'use strict';

const winston = require('winston');
const util = require('util');

function formatArgs (args) {
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

/**
 * Returns a function that will generate a preconfigured instance of winston.
 *
 * @return {function} A preconfigured instance of winston
 */
module.exports = () => {
  const logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)({
        timestamp: true,
        prettyPrint: true,
        handleExceptions: true
      })
    ]
  });
  logger.cli();

  console.log = function () {
    logger.info.apply(logger, formatArgs(arguments));
  };

  return logger;
};
