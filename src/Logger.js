import winston from 'winston';
import raven from 'raven';
import DetailError, { isError } from './Error';

winston.emitErrs = true;

class Logger extends winston.Logger {
  constructor(options) {
    const transports = [
      new winston.transports.Console({
        level: options.VERBOSE || 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ];

    super({
      transports,
      exitOnError: false
    });

    this._install(options);
  }

  _install(options) {
    const { NODE_ENV = 'dev', SENTRY_ENVIRONMENT = 'dev' } = options;
    this._error = this.error;
    if (NODE_ENV === 'production') {
      const sentrySettings = (({ SENTRY_API_KEY, SENTRY_URL, SENTRY_ID, SENTRY_ENVIRONMENT }) => ({
        SENTRY_API_KEY,
        SENTRY_URL,
        SENTRY_ID,
        SENTRY_ENVIRONMENT
      }))(options);

      if (Object.values(sentrySettings).every(value => value !== undefined)) {
        this._raven = this._initRaven(sentrySettings);
      }
    }

    this.error = function(...args) {
      if (SENTRY_ENVIRONMENT === 'production') {
        args.unshift('🔥-');
      }
      const err = new DetailError(...args);
      if (!args.find(i => isError(i))) {
        Error.captureStackTrace(err, this.error);
      }
      this._error(err);
      if (this._raven) {
        this._raven.captureException(err, { extra: { stack: err.stack } });
      }
    };
  }
  _initRaven({ SENTRY_API_KEY, SENTRY_URL, SENTRY_ID, SENTRY_ENVIRONMENT }) {
    return raven
      .config(`https://${SENTRY_API_KEY}@${SENTRY_URL}/${SENTRY_ID}`, {
        environment: SENTRY_ENVIRONMENT
      })
      .install();
  }
}
export default Logger;
