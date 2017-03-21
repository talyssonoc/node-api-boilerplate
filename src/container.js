const { createContainer, Lifetime } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const Server = require('./app/Server');
const logger = require('./app/logging/logger');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
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
  getAllUsers: GetAllUsers
});

module.exports = container;
