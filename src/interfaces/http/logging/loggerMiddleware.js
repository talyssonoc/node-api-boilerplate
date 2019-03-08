const morgan = require('morgan');
const LoggerStreamAdapter = require('src/infra/logging/LoggerStreamAdapter');

module.exports = ({ logger }) => morgan('dev', {
  stream: LoggerStreamAdapter.toStream(logger),
});
