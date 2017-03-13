const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('config').db;

const basename = path.basename(module.filename);
module.exports = {};

const sequelize = new Sequelize(config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    const modelName = file.split('.')[0];
    module.exports[modelName] = model;
  });

Object.keys(module.exports).forEach((modelName) => {
  if(module.exports[modelName].associate) {
    module.exports[modelName].associate(module.exports);
  }
});

module.exports.database = sequelize;
module.exports.Sequelize = Sequelize;
