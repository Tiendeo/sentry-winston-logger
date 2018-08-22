import Transport from 'winston-transport';
import raven from 'raven';
import DetailError, { isError } from './Error';

class RavenTransport extends Transport {
  constructor(options) {
    super(options);
    this._options = options;
    this._install(options);
  }

  _install(options) {
    const { env = 'dev', dsn, sentryEnv } = options;
    if (env === 'production') {
      if (Object.values({ dsn, sentryEnv }).every(value => value !== undefined)) {
        this._raven = this._initRaven({ dsn, environment: sentryEnv });
      }
    }
  }

  _initRaven({ dsn, environment }) {
    return raven.config(dsn, { environment }).install();
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    const { message } = info;
    const args = info.hasOwnProperty(Symbol.for('splat')) ? [message, ...info[Symbol.for('splat')]] : [message];

    const { sentryEnv } = this._options;
    if (sentryEnv === 'production') {
      args.unshift('🔥-');
    }
    const err = new DetailError(...args);
    if (!args.find(i => isError(i))) {
      Error.captureStackTrace(err, this.log);
    }
    if (this._raven) {
      this._raven.captureException(err, { extra: { stack: err.stack } });
    }
    callback();
  }
}
export default RavenTransport;
