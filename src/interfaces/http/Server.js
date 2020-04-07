const express = require('express');
const helmet = require('helmet');

class Server {
  constructor({ config, router, logger }) {
    this.config = config;
    this.logger = logger;
    this.express = express();

    this.express.use(helmet());
    this.express.use(router);
  }

  start() {
    return new Promise((resolve) => {
      const http = this.express
        .listen(this.config.web.port, () => {
          const { port } = http.address();
          this.logger.info(`[p ${process.pid}] Listening at port ${port}`);
          resolve();
        });
    });
  }
}

module.exports = Server;
