'use strict';

const Bot = require(process.env.PWD + '/lib/bot');
const config = require(process.env.PWD + '/config.default');

describe('Bot', () => {
  it('should instantiate a bot', () => {
    const bot = new Bot(config);

    expect(bot).toEqual(jasmine.any(Bot));
  });
});
