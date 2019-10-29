const UserMapper = require('./SequelizeUserMapper');
const BaseSequelizeRepository = require('../SequelizeBaseRepository');

class SequelizeUsersRepository extends BaseSequelizeRepository{
  constructor({ UserModel }) {
    super(UserModel,UserMapper);

  }
}

module.exports = SequelizeUsersRepository;
