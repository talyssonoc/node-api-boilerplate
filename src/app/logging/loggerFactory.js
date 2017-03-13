const Log4js = require('log4js');

module.exports = ({ config }) => {
  Log4js.configure(config.logging);

  return (loggerName) => {
    return Log4js.getLogger(loggerName);
  };
};
