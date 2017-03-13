class Application {
  constructor({ config, server, database, createLogger }) {
    this.config = config;
    this.server = server;
    this.database = database;

    if(this.database.options.logging) {
      const dbLogger = createLogger('db');
      this.database.options.logging = dbLogger.info.bind(dbLogger);
    }

  }

  start() {
    return Promise.resolve()
      .then(() => this.database.authenticate())
      .then(() => this.server.start());
  }
}

module.exports = Application;
