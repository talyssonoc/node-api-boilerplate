const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const ENV = process.env.NODE_ENV || 'development';
const config = require('config/database')[ENV];

const basename = path.basename(module.filename);
const DB = {};

const sequelize = new Sequelize(config);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    const modelName = file.split('.')[0];
    DB[modelName] = model;
  });

Object.keys(DB).forEach((modelName) => {
  if(DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

DB.sequelize = sequelize;
DB.Sequelize = Sequelize;

module.exports = DB;
