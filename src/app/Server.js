const express = require('express');

class Server {
  constructor({ config, router, createLogger }) {
    this.config = config;
    this.logger = createLogger('web');
    this.express = express();
    this.use(router);
  }

  use(...args) {
    return this.express.use(...args);
  }

  start /* istanbul ignore next */ () {
    return new Promise((resolve) => {
      const http = this.express
        .listen(this.config.web.port, () => {
          const { port } = http.address();
          /* eslint-disable no-console */
          this.logger.info(`Listening at port ${port}`);
          /* eslint-enable no-console */
          resolve();
        });
    });
  }
}

module.exports = Server;
