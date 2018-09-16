const { ModelsLoader } = require('src/infra/sequelize');
const Sequelize = require('sequelize');
const { db: config } = require('config');

if(config) {
  const sequelize = new Sequelize(config);

  module.exports = ModelsLoader.load({
    sequelize,
    baseFolder: __dirname
  });
} else {
  /* eslint-disable no-console */
  console.error('Database configuration not found, disabling database.');
  /* eslint-enable no-console */
}

