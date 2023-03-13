module.exports = class BaseError extends Error {
  constructor(message, status, code) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.status = status || 500;
    this.message = message || STATUS_CODES[this.status];
    this.code = code;
  }
};
