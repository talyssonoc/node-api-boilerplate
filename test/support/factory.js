const { Factory } = require('factory-girl');
const factoryGirlSequelize = require('factory-girl-sequelize');
const Bluebird = require('bluebird');
const fs = require('fs');
const path = require('path');

const models = require('src/infra/database/models');

const factory = new Factory().promisify(Bluebird);
factory.setAdapter(factoryGirlSequelize());

fs
  .readdirSync(path.join(__dirname, 'factories'))
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const factoryPath = path.join(__dirname, 'factories', file);
    const factoryCreator = require(factoryPath);

    factoryCreator(factory, models);
  });

module.exports = factory;
