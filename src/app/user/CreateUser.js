const Operation = require('src/app/Operation');
const User = require('src/domain/user/User');

class CreateUser extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  execute(userData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    const user = new User(userData);

    this.usersRepository
      .add(user)
      .then((newUser) => {
        this.emit(SUCCESS, newUser);
      })
      .catch((error) => {
        if(error.message === 'ValidationError') {
          return this.emit(VALIDATION_ERROR, error);
        }

        this.emit(ERROR, error);
      });
  }
}

CreateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateUser;
