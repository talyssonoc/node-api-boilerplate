const UserMapper = require('./SequelizeUserMapper');

class SequelizeUsersRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async getAll(...args) {
    const users = await this.UserModel.findAll(...args);

    return users.map(UserMapper.toEntity);
  }

  async getById(id) {
    try {
      const user = await this.UserModel.findById(id, { rejectOnEmpty: true });
      return UserMapper.toEntity(user);
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `User with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async add(user) {
    const { valid, errors } = user.validate();

    if(!valid) {
      const error = new Error('ValidationError');
      error.details = errors;

      throw error;
    }

    const newUser = await this.UserModel.create(UserMapper.toDatabase(user));
    return UserMapper.toEntity(newUser);
  }

  async count() {
    return await this.UserModel.count();
  }
}

module.exports = SequelizeUsersRepository;
