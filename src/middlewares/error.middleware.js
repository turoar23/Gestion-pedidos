module.exports.errorHandler = (error, req, res) => {
  let _error = { ...error };
  let status = _error.status || 500;
  const ERRORS_NAME = ['MongoError', 'ValidationError'];
  const ERROR_KEYS = ['_original'];
  if (ERROR_KEYS.includes(Object.keys(_error)[0]) || ERRORS_NAME.includes(_error.name)) {
    status = 400;
    if (_error.code === 11000) {
      _error = {
        name: 'BaseError',
        message: `Duplicated keys: ${Object.keys(_error?.keyPattern || {}).join(', ')}`,
      };
    }
    if (Object.keys(_error)[0] === '_original' && _error?.details?.[0].context.error) {
      _error = _error.details[0].context.error;
    }
  }
  _error.message = _error.message || 'Something went wrong';

  console.error(error);

  res.status(status).json(_error);
};
