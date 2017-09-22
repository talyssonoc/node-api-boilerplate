const Operation = require('src/app/Operation');

class DeleteUser extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  async execute(userId) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

    try {
      await this.usersRepository.remove(userId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteUser;
