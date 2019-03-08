const Umzug = require('umzug');
const path = require('path');

const { database, Sequelize } = require('src/infra/database/models/');

const migrator = async () => {
  const sequelize = database;
  const umzug = new Umzug({
    storage: 'sequelize',

    storageOptions: {
      sequelize,
    },

    migrations: {
      params: [
        sequelize.getQueryInterface(),
        Sequelize,
      ],
      path: path.join(__dirname, '../src/infra/database/migrate'),
    },
  });

  await umzug.up();
};

module.exports = migrator;
