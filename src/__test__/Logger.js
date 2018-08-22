import test from 'tape';
import proxyquire from 'proxyquire';
import { stub, spy } from 'sinon';

const infoSpy = spy();

const ravenMock = {
  config: stub().returns({
    install: stub().returns({
      captureException: infoSpy
    })
  })
};

const options = {
  NODE_ENV: 'production',
  SENTRY_ENVIRONMENT: 'production',
  VERBOSE: true,
  SENTRY_ENVIRONMENT: 'production',
  SENTRY_API_KEY: 'key',
  SENTRY_URL: 'url',
  SENTRY_ID: 'id'
};

const Logger = proxyquire('../Logger', {
  raven: ravenMock,
  '@noCallThru': true
}).default;

const fn = spy();

/**
 * Test logger
 */
test('logger', t => {
  t.test('Logger uses default options in config is empty', ({ isEqual, end }) => {
    const logger = new Logger({});
    isEqual(logger._raven, undefined, 'should create a Logger only with console transport');
    end();
  });

  t.test('Logger sends fire logs to Sentry when SENTRY_ENVIRONMENT is production', ({ isEqual, end }) => {
    const logger = new Logger(options);
    logger._error = fn;
    logger.error('foo');
    const [error] = fn.args[0];
    const message = error.message;
    isEqual(message, '🔥-foo', 'should create an error with fire');
    fn.reset();
    end();
  });

  t.test('Logger does not send fire logs to Sentry when SENTRY_ENVIRONMENT is production', ({ isEqual, end }) => {
    options.NODE_ENV = 'test';
    options.SENTRY_ENVIRONMENT = 'test';
    const logger = new Logger(options);
    logger._raven = undefined;
    logger._error = fn;
    logger.error('foo');
    const [error] = fn.args[0];
    const message = error.message;
    isEqual(message, 'foo', 'should create an error with fire');
    fn.reset();
    end();
  });

  t.test('Logger does not capture stack trace if args have Error', ({ notOk, end }) => {
    const logger = new Logger(options);
    logger._error = stub();
    Error.captureStackTrace = fn;
    logger.error(new Error('foo'));
    notOk(fn.calledOnce, 'not should capture errorstack');
    fn.reset();
    end();
  });
});
