const CreateUser = require('src/app/user/CreateUser');

describe('App :: User :: CreateUser', () => {
  var createUser;

  describe('when user is valid', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        add: (user) => Promise.resolve(user)
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    test('creates the user and emits SUCCESS', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.SUCCESS, (response) => {
        expect(response.name).toBe('New User');
        done();
      });

      createUser.execute(userData);
    });
  });

  describe('when user is invalid', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(Error('ValidationError'))
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    test('emits VALIDATION_ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.VALIDATION_ERROR, (response) => {
        expect(response.message).toBe('ValidationError');
        done();
      });

      createUser.execute(userData);
    });
  });

  describe('when there is an internal error', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(new Error('Some Error'))
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    test('emits ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      createUser.on(createUser.outputs.ERROR, (response) => {
        expect(response.message).toBe('Some Error');
        done();
      });

      createUser.execute(userData);
    });
  });
});
