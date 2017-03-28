const { ModelsLoader } = require('src/infra/sequelize');
const Sequelize = require('sequelize');
const config = require('config').db;

if(config) {
  const sequelize = new Sequelize(config);

  module.exports = ModelsLoader.load({
    sequelize,
    baseFolder: __dirname
  });
} else {
  /* eslint-disable no-console */
  console.error('Database config file log found, disabling database.');
  /* eslint-enable no-console */
}

