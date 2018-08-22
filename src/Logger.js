import winston from 'winston';
import RavenTransport from './transport';

const Logger = options => {
  const _options = { ...options } || {};
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new RavenTransport({
      handleExceptions: true,
      env: _options.env,
      dsn: _options.dsn,
      sentryEnv: _options.sentryEnv
    })
  ];

  return winston.createLogger({
    level: _options.VERBOSE || 'info',
    transports,
    exitOnError: false
  });
};

export default Logger;
