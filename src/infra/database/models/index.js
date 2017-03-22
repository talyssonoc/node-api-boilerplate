const { ModelsLoader } = require('src/infra/sequelize');
const Sequelize = require('sequelize');
const config = require('config').db;

const sequelize = new Sequelize(config);

module.exports = ModelsLoader.load({
  sequelize,
  baseFolder: __dirname
});
