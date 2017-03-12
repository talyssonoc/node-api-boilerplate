const { Router } = require('express');
const Status = require('http-status');

class UsersController {
  getRouter() {
    const router = Router();

    router.get('/', this.index);
    router.post('/', this.create);

    return router;
  }

  index(req, res, next) {
    const { getAllUsers } = req.container.cradle;
    const { SUCCESS, ERROR } = getAllUsers;

    getAllUsers
      .on(SUCCESS, (users) => {
        res.status(Status.OK).json(users);
      })
      .on(ERROR, next);

    getAllUsers.execute();
  }

  create(req, res, next) {
    const { createUser } = req.container.cradle;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser;

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
