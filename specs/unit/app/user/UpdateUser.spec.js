
const UpdateUser = require('src/app/user/UpdateUser');

describe('App :: User :: UpdateUser', () => {
  let updateUser;

  describe('when user exists', () => {
    describe('when data is valid', () => {
      beforeAll(() => {
        const MockUsersRepository = {
          update: (id, data) => Promise.resolve(data),
        };

        updateUser = new UpdateUser({
          usersRepository: MockUsersRepository,
        });
      });

      test('updates the user and emits SUCCESS', (done) => {
        const userData = { name: 'Updated User' };

        updateUser.on(updateUser.outputs.SUCCESS, (response) => {
          expect(response.name).toEqual('Updated User');
          done();
        });

        updateUser.execute(123, userData);
      });
    });

    describe('when data is invalid', () => {
      beforeAll(() => {
        const MockUsersRepository = {
          update: () => Promise.reject(Error('ValidationError')),
        };

        updateUser = new UpdateUser({
          usersRepository: MockUsersRepository,
        });
      });

      test('emits VALIDATION_ERROR with the error', (done) => {
        const userData = { name: 'New User' };

        updateUser.on(updateUser.outputs.VALIDATION_ERROR, (response) => {
          expect(response.message).toEqual('ValidationError');
          done();
        });

        updateUser.execute(321, userData);
      });
    });
  });

  describe('when the user does not exist', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        update: () => Promise.reject(new Error('NotFoundError')),
      };

      updateUser = new UpdateUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits NOT_FOUND with the error', (done) => {
      const userData = { name: 'New User' };

      updateUser.on(updateUser.outputs.NOT_FOUND, (response) => {
        expect(response.message).toEqual('NotFoundError');
        done();
      });

      updateUser.execute(123, userData);
    });
  });


  describe('when there is an internal error', () => {
    beforeAll(() => {
      const MockUsersRepository = {
        update: () => Promise.reject(new Error('Some Error')),
      };

      updateUser = new UpdateUser({
        usersRepository: MockUsersRepository,
      });
    });

    test('emits ERROR with the error', (done) => {
      const userData = { name: 'New User' };

      updateUser.on(updateUser.outputs.ERROR, (response) => {
        expect(response.message).toEqual('Some Error');
        done();
      });

      updateUser.execute(321, userData);
    });
  });
});
