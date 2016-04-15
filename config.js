const config = {
  app: {
    message: 'I am on vacation until Monday, April 25th', // The message you want to send to users
    timebox: {
      start: 2016/04/15, // start timestamp, or parsable date (see http://dygraphs.com/date-formats.html)
      end: 2016/04/24, // end timestmap, or parsable date (see http://dygraphs.com/date-formats.html)
    },
    reminder: 480, // minutes, Do not respond to the user for another 8 hours
    respond: {
      dm: true, // Respond to the user via DM
      channel: false, // respond in the channel to everyone
    },
  },
  slack: {
    token: 'xoxp-4897644109-4876068626-35211612884-ce16bd1e67', // get it from https://api.slack.com/web
    autoReconnect: true,
    autoMark: false, // Mark messages as read
  },
};

module.exports = config;
