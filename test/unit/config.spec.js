/* eslint-env node, jasmine */
'use strict';

const Config = require(process.env.PWD + '/lib/config');
let rawConfig;

describe('Config Parser', () => {
  beforeEach(() => {
    rawConfig = require(process.env.PWD + '/config.default');
  });

  describe('Boolean Parser', () => {
    it('should parse the string \'true\' into a boolean true', () => {
      expect(Config.parseBool('true')).toEqual(true);
      expect(Config.parseBool('True')).toEqual(true);
      expect(Config.parseBool('TRUE')).toEqual(true);
    });

    it('should parse the string \'1\' into a boolean true', () => {
      expect(Config.parseBool('1')).toEqual(true);
    });

    it('should parse any other string into a boolean false', () => {
      expect(Config.parseBool('false')).toEqual(false);
      expect(Config.parseBool('fsdfasdfasdf')).toEqual(false);
      expect(Config.parseBool('nope')).toEqual(false);
    });

    it('should pass the original value if not a string', () => {
      expect(Config.parseBool(1)).toEqual(1);
    });
  });

  describe('Date Parser', () => {
    it('should parse an ISO-8601 date', () => {
      expect(Config.parseDate('1982-05-20T18:39:00Z')).toEqual(390767940000);
    });

    it('should return a null value on a bad date', () => {
      expect(Config.parseDate('foo')).toEqual(null);
    });

    it('should parse "0" as a numeric zero', () => {
      expect(Config.parseDate('0')).toEqual(0);
    });
  });

  describe('Config Parser', () => {
    it('should parse default config as is', () => {
      expect(Config.parse(rawConfig)).toEqual(rawConfig);
    });

    it('should use env values over file values', () => {
      process.env.APP_MESSAGE = 'foo';
      const conf = Config.parse(rawConfig);

      expect(conf.app.message).toEqual('foo');
    });

    it('should throw an error if config is not an object', () => {
      expect(Config.parse.bind(null, 'foo')).toThrow('Config is not an object');
    });

    it('should throw an error if it cannot parse timebox.start', () => {
      rawConfig.app.timebox.start = 'foo';
      expect(Config.parse.bind(null, rawConfig)).toThrow('Could not parse timebox.start');
    });

    it('should throw an error if it cannot parse timebox.end', () => {
      rawConfig.app.timebox.end = 'foo';
      expect(Config.parse.bind(null, rawConfig)).toThrow('Could not parse timebox.end');
    });
  });
});
