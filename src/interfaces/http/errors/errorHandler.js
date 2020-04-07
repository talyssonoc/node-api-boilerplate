const Status = require('http-status');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { logger } = req.container.cradle;

  if (!res.headersSent) {
    logger.error(err);
    res.status(Status.INTERNAL_SERVER_ERROR).json({
      type: 'InternalServerError',
      message: 'The server failed to handle this request',
    });
  }
};
