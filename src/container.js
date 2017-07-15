const { createContainer, Lifetime } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  CreateUser,
  GetAllUsers,
  GetUser,
  UpdateUser,
  DeleteUser
} = require('./app/user');

const UserSerializer = require('./interfaces/http/user/UserSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');

const logger = require('./infra/logging/logger');
const SequelizeUsersRepository = require('./infra/user/SequelizeUsersRepository');
const { database, UserModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .registerClass({
    app: [Application, { lifetime: Lifetime.SINGLETON }],
    server: [Server, { lifetime: Lifetime.SINGLETON }]
  })
  .registerFunction({
    router: [router, { lifetime: Lifetime.SINGLETON }],
    logger: [logger, { lifetime: Lifetime.SINGLETON }]
  })
  .registerValue({ config });

// Middlewares
container
  .registerFunction({
    loggerMiddleware: [loggerMiddleware, { lifetime: Lifetime.SINGLETON }]
  })
  .registerValue({
    containerMiddleware: scopePerRequest(container),
    errorHandler: config.production ? errorHandler : devErrorHandler
  });

// Repositories
container.registerClass({
  usersRepository: [SequelizeUsersRepository, { lifetime: Lifetime.SINGLETON }]
});

// Database
container.registerValue({
  database,
  UserModel
});

// Operations
container.registerClass({
  createUser: CreateUser,
  getAllUsers: GetAllUsers,
  getUser: GetUser,
  updateUser: UpdateUser,
  deleteUser: DeleteUser
});

// Serializers
container.registerValue({
  userSerializer: UserSerializer
});

module.exports = container;
