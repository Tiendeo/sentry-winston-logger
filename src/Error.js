const isError = arg => arg instanceof Error;
class DetailError extends Error {
  constructor(...args) {
    const e = args.find(i => isError(i));
    const message = args.reduce((acc, i) => `${acc}${isError(i) ? i.message : i}`, '');
    super(message);
    if (e) {
      Object.defineProperty(this, 'stack', {
        get: function() {
          return e.stack;
        }
      });
    } else {
      Error.captureStackTrace(this, DetailError);
    }
  }
}
export { isError };
export default DetailError;
