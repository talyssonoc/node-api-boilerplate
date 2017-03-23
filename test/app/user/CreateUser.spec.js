const { expect } = require('chai');
const CreateUser = require('src/app/user/CreateUser');

describe('App :: User :: CreateUser', () => {
  var createUser;

  context('when user is valid', () => {
    before(() => {
      const MockUsersRepository = {
        add: (user) => Promise.resolve(user)
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    it('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.SUCCESS, (response) => {
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
        usersRepository: MockUsersRepository
      });
    });

    it('emits VALIDATION_ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.VALIDATION_ERROR, (response) => {
        expect(response.message).to.equal('ValidationError');
        done();
      });

      createUser.execute(userData);
    });
  });

  context('when there is an internal error', () => {
    before(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(new Error('Some Error'))
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Some Error');
        done();
      });

      createUser.execute(userData);
    });
  });
});
