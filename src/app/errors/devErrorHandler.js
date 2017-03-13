const Status = require('http-status');

/* istanbul ignore next */
module.exports = (err, req, res, next) => {
  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: err.message,
    stack: err.stack
  });
};
