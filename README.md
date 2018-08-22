# sentry-winston-logger

Logger with sentry support

### Dependencies

 - "raven": "^2.6.3"
 - "winston": "2.3.1"

### Usage

    import  Logger  from  "winston-raven-logger";
    ...
    const  options  =  {
		NODE_ENV
		VERBOSE,
		SENTRY_ENVIRONMENT,
		SENTRY_API_KEY,
		SENTRY_URL,
		SENTRY_ID
	};
	
	const logger = new Logger(options);
	logger.error(new Error('Test'));
	
If no options are provide, by default NODE_ENV is set to 'dev' , VERBOSE to 'debug and sentry raven is not set. In this case only console logs are showed.

### Install

    npm install winston-raven-logger --save
    
### Testing
    npm run test
    
### Next steps

 - [ ] Update to Winston  3 and create raven transport
