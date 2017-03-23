const Operation = require('src/app/Operation');

class GetAllUsers extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  execute() {
    const { SUCCESS, ERROR } = this.outputs;

    this.usersRepository
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
