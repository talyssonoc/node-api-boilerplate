const { ModelsLoder } = require('tbp/sequelize');
const Sequelize = require('sequelize');
const config = require('config').db;

const sequelize = new Sequelize(config);

module.exports = ModelsLoder.load({
  sequelize,
  baseFolder: __dirname
});
