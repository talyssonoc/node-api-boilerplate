const container = require('src/container');

const app = container.resolve('app');

app
  .start()
  .catch((error) => {
    console.error(error.stack);
    process.exit();
  });
