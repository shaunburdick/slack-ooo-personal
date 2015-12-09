FROM node:latest

MAINTAINER Shaun Burdick <docker@shaunburdick.com>

ENV NODE_ENV=production \
    APP_MESSAGE='I am out of the office' \
    APP_REMINDER=28800000 \
    APP_RESPOND_DM=true \
    APP_RESPOND_CHANNEL=false \
    APP_TIMEBOX_START=0 \
    APP_TIMEBOX_END=0 \
    SLACK_TOKEN=xoxb-foo \
    SLACK_AUTO_RECONNECT=true \
    SLACK_AUTO_MARK=true

ADD . /usr/src/myapp

WORKDIR /usr/src/myapp

RUN ["npm", "install"]

CMD ["npm", "start"]
