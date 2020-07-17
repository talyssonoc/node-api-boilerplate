const morgan = require('morgan');
const LoggerStreamAdapter = require('../../../infra/logging/LoggerStreamAdapter');

module.exports = ({ logger }) => {
  return morgan('dev', {
    stream: LoggerStreamAdapter.toStream(logger)
  });
};
