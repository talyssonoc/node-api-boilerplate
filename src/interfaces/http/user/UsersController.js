const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const UsersController = {
  get router() {
    const router = Router();

    router.get('/', inject('getAllUsers'), this.index);
    router.get('/:id', inject('getUser'), this.show);
    router.post('/', inject('createUser'), this.create);
    router.put('/:id', inject('updateUser'), this.update);

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

  show(req, res, next) {
    const { getUser } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getUser.outputs;

    getUser
      .on(SUCCESS, (user) => {
        res.status(Status.OK).json(user);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getUser.execute(Number(req.params.id));
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
  },

  update(req, res, next) {
    const { updateUser } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateUser.outputs;

    updateUser
      .on(SUCCESS, (user) => {
        res.status(Status.ACCEPTED).json(user);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    updateUser.execute(Number(req.params.id), req.body);
  }
};

module.exports = UsersController;
