'use strict';

const test = require('tape');
const Bot = require(process.env.PWD + '/lib/bot');
const config = require(process.env.PWD + '/config.default');

test('Bot: Shoud instantiate', (assert) => {
  const bot = new Bot(config);

  assert.ok(bot);
  assert.end();
});
