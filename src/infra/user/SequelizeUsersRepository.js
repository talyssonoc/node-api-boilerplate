const UserMapper = require('./SequelizeUserMapper');
const BaseSequelizeRepository = require('../SequelizeBaseRepository');

class SequelizeUsersRepository extends BaseSequelizeRepository{
  constructor({ UserModel }) {
    super(UserModel,UserMapper);

  }
}

module.exports = SequelizeUsersRepository;


function  x (){
  let promise = new Promise();

  let generateConfigREturnedValue = createUser(null, usercreationInput).
      sendEmail(createUSerReturnedValue, sendEmailInput).
      generateConfig(sendEmailReturnedValue, generateConfigInput).
      finish();
};
