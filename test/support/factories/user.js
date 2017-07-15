const dataFaker = require('src/infra/support/dataFaker');

module.exports = (factory, { UserModel }) => {
  factory.define('user', UserModel, {
    name: dataFaker.name()
  });
};
