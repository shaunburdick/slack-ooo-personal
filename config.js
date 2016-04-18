const config = {
  app: {
    message: process.env.APP_MESSAGE, // The message you want to send to users
    timebox: {
      start: process.env.APP_TIMEBOX_START, // start timestamp, or parsable date (see http://dygraphs.com/date-formats.html)
      end: process.env.APP_TIMEBOX_END, // end timestmap, or parsable date (see http://dygraphs.com/date-formats.html)
    },
    reminder: process.env.APP_REMINDER, // minutes, Do not respond to the user for another 8 hours
    respond: {
      dm: process.env.APP_RESPOND_DM, // Respond to the user via DM
      channel: process.env.APP_RESPOND_CHANNEL, // respond in the channel to everyone
    },
  },
  slack: {
    token: process.env.SLACK_TOKEN, // get it from https://api.slack.com/web
    autoReconnect: process.env.SLACK_AUTO_RECONNECT,
    autoMark: process.env.SLACK_AUTO_MARK, // Mark messages as read
  },
};

module.exports = config;
