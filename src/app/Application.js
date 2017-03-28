class Application {
  constructor({ server, database, logger }) {
    this.server = server;
    this.database = database;
    this.logger = logger;

    if(database && database.options.logging) {
      database.options.logging = logger.info.bind(logger);
    }
  }

  start() {
    return Promise.resolve()
      .then(() => this.database && this.database.authenticate())
      .then(() => this.server.start());
  }
}

module.exports = Application;
