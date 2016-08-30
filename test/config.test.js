'use strict';

const test = require('tape');
const Config = require(`${process.env.PWD}/lib/config`);
const rawConfig = require(`${process.env.PWD}/config.default`);

test('Config: Config: parse the string \'true\' into a boolean true', (assert) => {
  assert.equal(Config.parseBool('true'), true);
  assert.equal(Config.parseBool('True'), true);
  assert.equal(Config.parseBool('TRUE'), true);
  assert.end();
});

test('Config: parse the string \'1\' into a boolean true', (assert) => {
  assert.equal(Config.parseBool('1'), true);
  assert.end();
});

test('Config: parse any other string into a boolean false', (assert) => {
  assert.equal(Config.parseBool('false'), false);
  assert.equal(Config.parseBool('lksjfljksdf'), false);
  assert.equal(Config.parseBool('nope'), false);
  assert.end();
});

test('Config: pass the original value if not a string', (assert) => {
  assert.equal(Config.parseBool(1), 1);
  assert.end();
});

test('Config: date parsing', (assert) => {
  assert.equal(Config.parseDate('1982-05-20T18:39:00Z'), 390767940000,
    'It should parse an ISO-8601 date'
  );

  assert.equal(Config.parseDate('foo'), null,
    'It should return a null on a bad date'
  );

  assert.equal(Config.parseDate('0'), 0,
    'It should parse 0 as a numeric 0'
  );

  assert.end();
});

test('Config: parse default config as is', (assert) => {
  assert.equal(Config.parse(rawConfig), rawConfig);
  assert.end();
});

test('Config: should use env values over files', (assert) => {
  process.env.APP_MESSAGE = 'foo';
  const conf = Config.parse(rawConfig);

  assert.equal(conf.app.message, 'foo', 'Message should be ENV value foo');

  assert.end();
});

test('Config: throw on invalid config', (assert) => {
  assert.throws(Config.parse.bind(null, 'foo'), /Config is not an object/);

  assert.end();
});

test('Config: throw if cannot parse timeboxes', (assert) => {
  rawConfig.app.timebox.start = 'foo';

  assert.throws(Config.parse.bind(null, rawConfig), /Could not parse timebox\.start/);

  assert.end();
});
