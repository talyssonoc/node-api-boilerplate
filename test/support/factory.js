const { FactoriesLoader } = require('tbp/factoryGirl');
const { Factory } = require('factory-girl');
const factoryGirlSequelize = require('factory-girl-sequelize');
const Bluebird = require('bluebird');
const path = require('path');

const models = require('src/infra/database/models');

const factoryGirl = new Factory().promisify(Bluebird);
factoryGirl.setAdapter(factoryGirlSequelize());

module.exports = FactoriesLoader.load({
  factoryGirl,
  models,
  baseFolder: path.join(__dirname, 'factories')
});
