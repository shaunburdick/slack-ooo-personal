FROM node:alpine

MAINTAINER Shaun Burdick <docker@shaunburdick.com>

RUN apk add -U tzdata

ENV NODE_ENV=production \
    APP_MESSAGE='I am out of the office' \
    APP_REMINDER=480 \
    APP_RESPOND_DM=true \
    APP_RESPOND_CHANNEL=false \
    APP_RESPOND_BOT=false \
    APP_RESPOND_KEYWORDS= \
    APP_RESPONSE_DMPREFIX= \
    APP_RESPONSE_CHANNELPREFIx= \
    APP_TIMEBOX_START=0 \
    APP_TIMEBOX_END=0 \
    APP_ANNOUNCE_CHANNELS= \
    APP_ANNOUNCE_TIMES= \
    SLACK_TOKEN=xoxb-foo \
    SLACK_AUTO_RECONNECT=true \
    SLACK_AUTO_MARK=false

ADD . /usr/src/myapp

WORKDIR /usr/src/myapp

RUN ["npm", "install"]

CMD ["npm", "start"]
