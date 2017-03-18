const UserMapper = require('./SequelizeUserMapper');

class SequelizeUsersRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  getAll(...args) {
    return this.UserModel
      .findAll(...args)
      .then((users) => users.map(UserMapper.toEntity));
  }

  add(user) {
    const { valid, errors } = user.validate();

    if(!valid) {
      const error = new Error('ValidationError');
      error.details = errors;

      return Promise.reject(error);
    }

    return this.UserModel
      .create(UserMapper.toDatabase(user))
      .then(UserMapper.toEntity);
  }

  count() {
    return this.UserModel.count();
  }
}

module.exports = SequelizeUsersRepository;
