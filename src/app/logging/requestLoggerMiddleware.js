const morgan = require('morgan');
const LoggerStreamAdapter = require('src/infra/logging/LoggerStreamAdapter');

module.exports = ({ createLogger }) => {
  return morgan('dev', {
    stream: LoggerStreamAdapter.toStream(createLogger('web'))
  });
};
