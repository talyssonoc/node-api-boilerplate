const User = require('src/domain/user/User');

const SequelizeUserMapper = {
  toEntity(dbSurvivor) {
    const { id, name } = dbSurvivor.get({ plain: true });

    return new User({ id, name });
  },

  toDatabase(survivor) {
    const { name } = survivor;

    return { name };
  }
};

module.exports = SequelizeUserMapper;
