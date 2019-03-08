

const dataFaker = require('src/infra/support/dataFaker');

module.exports = {
  up(queryInterface) {
    const testUsers = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      testUsers.push({
        name: dataFaker.name(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('users', testUsers, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
