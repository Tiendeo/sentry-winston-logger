import Logger from './Logger';
const logger = new Logger();
try {
  const data = undefined.data;
} catch (err) {
  logger.error(new Error('hola'));
}

//export default Logger;
