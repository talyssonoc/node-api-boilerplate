const { createContainer, asClass, asFunction, asValue } = require('awilix');
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

const LogAppender = require('../src/infra/logging/MemoryAppender.js');
const Server = require('./interfaces/http/Server');
const appMetrics = require('./app/appMetrics');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const loggerIdInjectorMiddleware = require('./interfaces/http/MiddleWare/LogIdInjectorMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const logger = require('./infra/logging/logger');
const ControllerLogger = require('./infra/logging/ControllerLogger');
const Tracelogger = require('./infra/logging/dataTraceLogger');

const SequelizeUsersRepository = require('./infra/user/SequelizeUsersRepository');
const { database, User: UserModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton(),
    appMetrics: asClass(appMetrics)
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton(),
    Tracelogger:asFunction(Tracelogger).singleton(),
    ControllerLogger:asFunction(ControllerLogger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware]),
    appenderConfig: asFunction(LogAppender.config).singleton(),
    appenderBuffer: asValue(LogAppender.buffer)
  })
  .register({
    loggerIdInjectorMiddleware:asFunction(loggerIdInjectorMiddleware).singleton()
  });

// Repositories
container.register({
  usersRepository: asClass(SequelizeUsersRepository).setLifetime('TRANSIENT')
});

// Database
container.register({
  database: asValue(database),
  UserModel: asValue(UserModel)
});

// Operations
container.register({
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  getUser: asClass(GetUser),
  updateUser: asClass(UpdateUser),
  deleteUser: asClass(DeleteUser)
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer)
});

module.exports = container;
