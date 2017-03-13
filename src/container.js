const { createContainer, Lifetime } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const Server = require('./app/Server');
const router = require('./app/routing/router');
const loggerFactory = require('./app/logging/loggerFactory');
const requestLoggerMiddleware = require('./app/logging/requestLoggerMiddleware');
const errorHandler = require('./app/errors/errorHandler');
const devErrorHandler = require('./app/errors/devErrorHandler');
const { CreateUser, GetAllUsers } = require('./domain/user/operations');
const SequelizeUsersRepository = require('./infra/user/SequelizeUsersRepository');
const { database, User: UserModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .registerClass({
    app: [Application, { lifetime: Lifetime.SINGLETON }],
    server: [Server, { lifetime: Lifetime.SINGLETON }]
  })
  .registerFunction({
    router: [router, { lifetime: Lifetime.SINGLETON }],
    createLogger: [loggerFactory, { lifetime: Lifetime.SINGLETON }]
  })
  .registerValue({ config });

// Middlewares
container
  .registerFunction({
    requestLoggerMiddleware: [requestLoggerMiddleware, { lifetime: Lifetime.SINGLETON }]
  })
  .registerValue({
    containerMiddleware: scopePerRequest(container),
    errorHandler: config.production ? errorHandler : devErrorHandler
  });

// Repositories
container.registerClass({
  UsersRepository: [SequelizeUsersRepository, { lifetime: Lifetime.SINGLETON }]
});

// Database
container.registerValue({
  database,
  UserModel
});

// Operations
container.registerClass({
  createUser: CreateUser,
  getAllUsers: GetAllUsers
});

module.exports = container;
