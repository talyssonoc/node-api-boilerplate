const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const UsersController = {
  get router() {
    const router = Router();

    router.use(inject('userSerializer'));

    router.get('/', inject('getAllUsers'), this.index);
    router.get('/:id', inject('getUser'), this.show);
    router.post('/', inject('createUser'), this.create);
    router.put('/:id', inject('updateUser'), this.update);
    router.delete('/:id', inject('deleteUser'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getAllUsers, userSerializer } = req;
    const { SUCCESS, ERROR } = getAllUsers.outputs;

    getAllUsers
      .on(SUCCESS, (users) => {
        res
          .status(Status.OK)
          .json(users.map(userSerializer.serialize));
      })
      .on(ERROR, next);

    getAllUsers.execute();
  },

  show(req, res, next) {
    const { getUser, userSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getUser.outputs;

    getUser
      .on(SUCCESS, (user) => {
        res
          .status(Status.OK)
          .json(userSerializer.serialize(user));
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
    const { createUser, userSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;

    createUser
      .on(SUCCESS, (user) => {
        res
          .status(Status.CREATED)
          .json(userSerializer.serialize(user));
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
    const { updateUser, userSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateUser.outputs;

    updateUser
      .on(SUCCESS, (user) => {
        res
          .status(Status.ACCEPTED)
          .json(userSerializer.serialize(user));
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
  },

  delete(req, res, next) {
    const { deleteUser } = req;
    const { SUCCESS, ERROR,  NOT_FOUND } = deleteUser.outputs;

    deleteUser
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    deleteUser.execute(Number(req.params.id));
  }
};

module.exports = UsersController;
