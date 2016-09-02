const config = {
  app: {
    message: '', // The message you want to send to users
    timebox: {
      start: 0, // start timestamp, or parsable date (see http://dygraphs.com/date-formats.html)
      end: 0 // end timestmap, or parsable date (see http://dygraphs.com/date-formats.html)
    },
    reminder: 480, // minutes, Do not respond to the user for another 8 hours
    respond: {
      dm: true, // Respond to the user via DM
      channel: false, // respond in the channel to everyone
      keywords: [ // other keywords to respond to

      ]
    },
    response: {
      dmprefix: "Hello ${user}. I'm currently out of the office with message:\n\n", // '${user}' will be replaced with user contacting you
      channelprefix: "Hello ${channel}. I'm currently out of the office with message:\n\n" // '${channel}' will be replaced with the channel name
    }
  },
  slack: {
    token: 'xoxb-Your-Token', // get it from https://api.slack.com/web
    autoReconnect: true,
    autoMark: false // Mark messages as read
  }
};

module.exports = config;
