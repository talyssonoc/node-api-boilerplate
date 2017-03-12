const User = require('src/domain/user/User');

const SequelizeUserAdapter = {
  toEntity({ dataValues }) {
    const { id, name } = dataValues;

    return new User({ id, name });
  },

  toDatabase(survivor) {
    const { name } = survivor;

    return { name };
  }
};

module.exports = SequelizeUserAdapter;
