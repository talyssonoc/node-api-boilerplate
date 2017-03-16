const Operation = require('src/app/Operation');

class GetAllUsers extends Operation {
  constructor({ UsersRepository }) {
    super();
    this.UsersRepository = UsersRepository;
  }

  execute() {
    const { SUCCESS, ERROR } = this;

    this.UsersRepository
      .getAll({
        attributes: ['id', 'name']
      })
      .then((users) => {
        this.emit(SUCCESS, users);
      })
      .catch((error) => {
        this.emit(ERROR, error);
      });
  }
}

GetAllUsers.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllUsers;
