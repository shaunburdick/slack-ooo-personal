# Personal Out of Office Bot for Slack

[![Build Status](https://travis-ci.org/shaunburdick/slack-ooo-personal.svg?branch=master)](https://travis-ci.org/shaunburdick/slack-ooo-personal) [![Docker Pulls](https://img.shields.io/docker/pulls/shaunburdick/slack-ooo-personal.svg?maxAge=2592000)](https://hub.docker.com/r/shaunburdick/slack-ooo-personal/)
[![Coverage Status](https://coveralls.io/repos/github/shaunburdick/slack-ooo-personal/badge.svg?branch=update-dep)](https://coveralls.io/github/shaunburdick/slack-ooo-personal?branch=update-dep) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-round)](https://github.com/Flet/semistandard)

[![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/?repo=https://github.com/shaunburdick/slack-ooo-personal) [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

This bot acts as you and will respond to DMs and Channel mentions with a message while you are away.

## Features
- Start time: Set a start and the bot will wait until set time before listening and responding
- End time: Set an end time and the bot will shut off on a set time
- Respond to IM/Multi-Person IM when someone directly messages you
- Respond to a channel where you are directly mentioned (@username)
- Respond to additional keywords (ex 'shaun, burdick')
- Reminder buffer: Bot will not respond to user/channel until a given time has elapsed (to prevent spamming)
- Auto Mark: Bot can mark all your messages as read
- The bot can be configured to announce out of office users to specific channels on specific times (you must be in that channel to make the announcement)

## Personal Slack Token
You can generate your personal Slack Token here: [https://api.slack.com/custom-integrations/legacy-tokens](https://api.slack.com/custom-integrations/legacy-tokens)

## Announcements
The bot can announce which users are out of office on a schedule. To enable this feature, you need to provide the bot with a list of channels to make the announcement and at what times (local to bot).
- **app.announce.channels**: this is an array of channel names to announce to
  - The bot *must* be a member of the channel in order to make the announcements
  - channels names *must* not contain the starting `#`
- **app.announce.times**: this is an array of times each day to make the announcement
  - Each time will be considered as 24-hour time, (ie `13:00` is 1:00 pm)

## Install
1. Clone this [repository](https://github.com/shaunburdick/slack-ooo-personal.git)
2. `npm install`
3. Copy `./config.default.js` to `./config.js` and fill it out
4. `npm start`

## Test
1. `npm install` (make sure your NODE_ENV != `production`)
2. `npm test`

## Docker
Build an image using `docker build -t your_image:tag`

Official Image [shaunburdick/slack-ooo-personal](https://registry.hub.docker.com/u/shaunburdick/slack-ooo-personal/)

### Configuration Environment Variables
You can set the configuration of the bot by using environment variables. ENVIRONMENT_VARIABLE=Default Value
- APP_MESSAGE='', Your OoO Message
- APP_REMINDER=480, Time to wait before responding to person/channel again (in minutes)
- APP_RESPOND_DM=true, If true, will respond to Direct messages
- APP_RESPOND_CHANNEL=false, If true, will respond on Channel mentions
- APP_RESPOND_BOT=false, If true, will respond to bot messages
- APP_RESPOND_KEYWORDS=, A comma separated list of additional keywords to respond to
- APP_RESPONSE_DMPREFIX='Hello ${user}. I\'m currently out of the office with message:\n\n'
- APP_RESPONSE_CHANNELPREFIX='Hello ${channel}. I\'m currently out of the office with message:\n\n'
- APP_TIMEBOX_START=0, Time to start responding (Timestamp in milliseconds, or [parsable](https://www.iso.org/iso-8601-date-and-time-format.html) date)
- APP_TIMEBOX_END=0, Time to stop responding (Timestamp in milliseconds, or [parsable](https://www.iso.org/iso-8601-date-and-time-format.html) date)
- APP_ANNOUNCE_CHANNELS=general,random, A list of channels to announce OoO on
- APP_ANNOUNCE_TIMES=08:00,16:00, A list of times to announce OoO users
- SLACK_TOKEN=xoxb-foo, Your Slack Token
- SLACK_AUTO_RECONNECT=true, Reconnect on disconnect
- SLACK_AUTO_MARK=false, Mark messages as read

Set them using the `-e` flag while running docker:

```
docker run -it \
-e SLACK_TOKEN=xobp-blarty-blar-blar \
-e APP_MESSAGE='I am out of the office' \
-e APP_TIMEBOX_START='2015-12-24 17:00:00' \
-e APP_TIMEBOX_END='2015-12-26 08:00:00' \
shaunburdick/slack-ooo-personal:latest
```

## Heroku
**A note for Heroku users** This bot does not have a web server. Due to some initial decisions by Heroku, if you don't supply a web dyno config it will assume one anyways and try to start it. It will then stop your app after 60 seconds becuase it didn't bind to $PORT. To get around this, you will need to adjust the web scale to 0 manually. [Reference](https://stackoverflow.com/questions/40265699/is-it-possible-to-deploy-a-node-js-application-to-heroku-without-a-web-dyno) [Comment](https://github.com/shaunburdick/slack-ooo-personal/issues/20#issuecomment-318375858)

## Contributing
1. Create a new branch, please don't work in master directly.
2. Add failing tests for the change you want to make (if appliciable). Run `npm test` to see the tests fail.
3. Fix stuff.
4. Run `npm test` to see if the tests pass. Repeat steps 2-4 until done.
5. Update the documentation to reflect any changes.
6. Push to your fork and submit a pull request.
