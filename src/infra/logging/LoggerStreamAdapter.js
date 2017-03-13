const LoggerStreamAdapter = {
  toStream(logger) {
    return {
      write(message) {
        logger.info(message.slice(0, -1));
      }
    };
  }
};

module.exports = LoggerStreamAdapter;
