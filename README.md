# Personal Out of Office Bot for Slack
This bot acts as you and will respond to DMs and Channel mentions with a message.

## Personal Slack Token
You can generate your personal Slack Token here: [https://api.slack.com/web](https://api.slack.com/web)

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
You can set the configuration of the bot by using environment variables. _ENVIRONMENT_VARIABLE_=Default Value
- _APP_MESSAGE_='', Your OoO Message
- _APP_REMINDER_=28800000, Time to wait before responding to person/channel again (in milleseconds)
- _APP_RESPOND_DM_=true, If true, will respond to Direct messages
- _APP_RESPOND_CHANNEL_=false, If true, will respond on Channel mentions
- _APP_TIMEBOX_START_=0, Time to start responding (Timestamp in milleseconds)
- _APP_TIMEBOX_END_=0, Time to stop responding (Timestamp in milleseconds)
- _SLACK_TOKEN_=xoxb-foo, Your Slack Token
- _SLACK_AUTO_RECONNECT_=true, Reconnect on disconnect
- _SLACK_AUTO_MARK_=false, Mark messages as read

Set them using the `-e` flag while running docker:

```
docker run -it \
-e SLACK_TOKEN=xobp-blarty-blar-blar \
-e SLACK_MESSAGE='I am out of the office' \
shaunburdick/slack-ooo-personal:latest
```
