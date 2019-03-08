
const DeleteUser = require('src/app/user/DeleteUser');

describe('App :: User :: DeleteUser', () => {
  let deleteUser;

  describe('when user exists', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        remove: () => Promise.resolve(),
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('deletes the user and emits SUCCESS with no payload', (done) => {
      deleteUser.on(deleteUser.outputs.SUCCESS, (response) => {
        expect(response).toBeUndefined();
        done();
      });

      deleteUser.execute(123);
    });
  });

  describe('when the user does not exist', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        remove: () => Promise.reject(new Error('NotFoundError')),
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits NOT_FOUND with the error', (done) => {
      deleteUser.on(deleteUser.outputs.NOT_FOUND, (response) => {
        expect(response.message).toEqual('NotFoundError');
        done();
      });

      deleteUser.execute(123);
    });
  });


  describe('when there is an internal error', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        remove: () => Promise.reject(new Error('Some Error')),
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits ERROR with the error', (done) => {
      deleteUser.on(deleteUser.outputs.ERROR, (response) => {
        expect(response.message).toEqual('Some Error');
        done();
      });

      deleteUser.execute(321);
    });
  });
});
