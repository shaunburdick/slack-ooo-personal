var config = {
  app: {
    message: '', // The message you want to send to users
    timebox: {
      start: 0, // start timestamp
      end: 0, // end timestmap
    },
    reminder: 28800000, // Do not respond to the user for another 8 hours
    respond: {
      dm: true, // Respond to the user via DM
      channel: false, // respond in the channel to everyone
    },
  },
  slack: {
    token: 'xoxb-Your-Token', // get it from https://api.slack.com/web
    autoReconnect: true,
    autoMark: false, // Mark messages as read
  },
};

module.exports = config;
