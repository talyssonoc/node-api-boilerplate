const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const UsersController = {
  get router() {
    const router = Router();

    router.get('/', inject('getAllUsers'), this.index);
    router.post('/', inject('createUser'), this.create);

    return router;
  },

  index(req, res, next) {
    const { getAllUsers } = req;
    const { SUCCESS, ERROR } = getAllUsers.outputs;

    getAllUsers
      .on(SUCCESS, (users) => {
        res.status(Status.OK).json(users);
      })
      .on(ERROR, next);

    getAllUsers.execute();
  },

  create(req, res, next) {
    const { createUser } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;

    createUser
      .on(SUCCESS, (user) => {
        res.status(Status.CREATED).json(user);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createUser.execute(req.body);
  }
}

module.exports = UsersController;
