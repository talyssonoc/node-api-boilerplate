const { expect } = require('chai');
const CreateUser = require('src/domain/user/operations/CreateUser');

describe('Domain :: User :: CreateUser', () => {
  var createUser;

  context('when user is valid', () => {
    before(() => {
      const MockUsersRepository = {
        add: (user) => Promise.resolve(user)
      };

      createUser = new CreateUser({
        UsersRepository: MockUsersRepository
      });
    });

    it('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.SUCCESS, (response) => {
        expect(response.name).to.equal('New User');
        done();
      });

      createUser.execute(userData);
    });
  });

  context('when user is invalid', () => {
    before(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(Error('ValidationError'))
      };

      createUser = new CreateUser({
        UsersRepository: MockUsersRepository
      });
    });

    it('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.VALIDATION_ERROR, (response) => {
        expect(response.message).to.equal('ValidationError');
        done();
      });

      createUser.execute(userData);
    });
  });

  context('when there is an internal error', () => {
    before(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(Error('Some Error'))
      };

      createUser = new CreateUser({
        UsersRepository: MockUsersRepository
      });
    });

    it('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.ERROR, (response) => {
        expect(response.message).to.equal('Some Error');
        done();
      });

      createUser.execute(userData);
    });
  });
});
