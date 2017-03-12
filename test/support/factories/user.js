const dataFaker = require('src/infra/support/dataFaker');

module.exports = (factory, { User }) => {
  factory.define('user', User, {
    name: dataFaker.name()
  });
};
