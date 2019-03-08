
const CreateUser = require('src/app/user/CreateUser');

describe('App :: User :: CreateUser', () => {
  let createUser;

  describe('when user is valid', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        add: user => Promise.resolve(user),
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.SUCCESS, (response) => {
        expect(response.name).toEqual('New User');
        done();
      });

      createUser.execute(userData);
    });
  });

  describe('when user is invalid', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(Error('ValidationError')),
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits VALIDATION_ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.VALIDATION_ERROR, (response) => {
        expect(response.message).toEqual('ValidationError');
        done();
      });

      createUser.execute(userData);
    });
  });

  describe('when there is an internal error', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(new Error('Some Error')),
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.ERROR, (response) => {
        expect(response.message).toEqual('Some Error');
        done();
      });

      createUser.execute(userData);
    });
  });
});
