const { createContainer, Lifetime } = require('awilix');

const SequelizeUsersRepository = require('src/infra/user/SequelizeUsersRepository');
const { User: UserModel } = require('src/infra/database/models');
const { CreateUser, GetAllUsers } = require('src/domain/user/operations');

const container = createContainer();

// Repositories
container.registerClass({
  UsersRepository: [SequelizeUsersRepository, { lifetime: Lifetime.SINGLETON }]
});

// Database models
container.registerValue({
  UserModel
});

// Operations
container.registerClass({
  createUser: CreateUser,
  getAllUsers: GetAllUsers
});

module.exports = container;
