const faker = require('faker');

module.exports = (factory, { User }) => {
  factory.define('user', User, {
    name: faker.word,
  });
};
