/* eslint-env node, jasmine */
'use strict';

const winston = require('winston');

describe('Logger', () => {
  it('should create an instance of logger', () => {
    const logger = require(process.env.PWD + '/lib/logger')();
    expect(logger).toEqual(jasmine.any(winston.Logger));
  });
});
