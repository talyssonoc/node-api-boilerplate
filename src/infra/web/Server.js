const express = require('express');

class Server {
  constructor({ config }) {
    this.config = config;
    this.express = express();
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
          console.log(`Listening at port ${port}`);
          /* eslint-enable no-console */
          resolve();
        });
    });
  }
}

module.exports = Server;
