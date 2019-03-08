const container = require('./src/container');
const host = require('./config/utils/host');

host.then(async (address) => {
  process.env.MACHINE_HOST = address;
  const env = process.env.NODE_ENV || 'development';
  await require('./config/ssm')(env);
  await require('./config/migrator')();
}).then(() => {
  const app = container.resolve('app');
  app
    .start()
    .then(() => {
      if (process.env.APPLICATION_STAGE === 'production'
        || process.env.APPLICATION_STAGE === 'staging') {
        /* eslint-disable-next-line global-require */
        require('./config/newrelic');
      }
    })
    .catch((error) => {
      app.logger.error(error.stack);
      process.exit();
    });
});
