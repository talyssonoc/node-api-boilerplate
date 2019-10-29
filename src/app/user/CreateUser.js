const Operation = require('src/app/Operation');
const User = require('src/domain/user/User');

class CreateUser extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  async execute(userData) {
    super.execute();
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    const user = new User(userData);

    try {
      /**
       * The logStep method is one of multiple predefined logging methods
       * that create the log trace.
       * they are used here only for demonstration
       */
      this.logStep({step:'adding user to repository', data:userData});
      const newUser = await this.usersRepository.add(user);
      this.logStep({step:'Emitting success event', data:newUser});
      this.emit(SUCCESS, newUser);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.logError({error:error});
      this.emit(ERROR, error);
    }
  }
}

CreateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateUser;
