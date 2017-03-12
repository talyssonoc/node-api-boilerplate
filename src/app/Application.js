class Application {
  constructor({ config, server }) {
    this.config = config;
    this.server = server;
  }

  start() {
    return this.server.start();
  }
}

module.exports = Application;
