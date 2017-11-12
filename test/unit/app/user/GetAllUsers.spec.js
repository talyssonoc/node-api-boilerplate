const GetAllUsers = require('src/app/user/GetAllUsers');

describe('App :: User :: GetAllUsers', () => {
  var getAllUsers;

  describe('when query is successful', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        getAll: () => Promise.resolve('Imagine all the users...')
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository
      });
    });

    test('emits SUCCESS with all the users', (done) => {
      getAllUsers.on(getAllUsers.outputs.SUCCESS, (response) => {
        expect(response).toBe('Imagine all the users...');
        done();
      });

      getAllUsers.execute();
    });
  });

  describe('when there is an internal error', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        getAll: () => Promise.reject(new Error('Failed'))
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository
      });
    });

    test('emits ERROR with the error', (done) => {
      getAllUsers.on(getAllUsers.outputs.ERROR, (response) => {
        expect(response.message).toBe('Failed');

        done();
      });

      getAllUsers.execute();
    });
  });
});
