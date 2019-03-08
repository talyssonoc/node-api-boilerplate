
const GetAllUsers = require('src/app/user/GetAllUsers');

describe('App :: User :: GetAllUsers', () => {
  let getAllUsers;

  describe('when query is successful', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        getAll: () => Promise.resolve('Imagine all the users...'),
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits SUCCESS with all the users', (done) => {
      getAllUsers.on(getAllUsers.outputs.SUCCESS, (response) => {
        expect(response).toEqual('Imagine all the users...');
        done();
      });

      getAllUsers.execute();
    });
  });

  describe('when there is an internal error', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        getAll: () => Promise.reject(new Error('Failed')),
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits ERROR with the error', (done) => {
      getAllUsers.on(getAllUsers.outputs.ERROR, (response) => {
        expect(response.message).toEqual('Failed');

        done();
      });

      getAllUsers.execute();
    });
  });
});
