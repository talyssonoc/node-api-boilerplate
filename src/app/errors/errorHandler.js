const Status = require('http-status');

module.exports = (err, req, res, next) => {
  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: 'The server failed to handle this request'
  });
};
