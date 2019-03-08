const path = require('path');
const { factory, SequelizeAdapter } = require('factory-bot');
const { FactoriesLoader } = require('src/infra/factoryBot');
const models = require('src/infra/database/models/');

factory.setAdapter(new SequelizeAdapter());


module.exports = FactoriesLoader.load({
  factoryGirl: factory,
  models,
  baseFolder: path.join(__dirname, 'factories'),
});
