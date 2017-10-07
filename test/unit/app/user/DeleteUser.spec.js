const { expect } = require('chai');
const DeleteUser = require('src/app/user/DeleteUser');

describe('App :: User :: DeleteUser', () => {
  var deleteUser;

  context('when user exists', () => {
    before(() => {
      const MockUsersRepository = {
        remove: () => Promise.resolve()
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository
      });
    });

    it('deletes the user and emits SUCCESS with no payload', (done) => {
      deleteUser.on(deleteUser.outputs.SUCCESS, (response) => {
        expect(response).to.be.undefined();
        done();
      });

      deleteUser.execute(123);
    });
  });

  context('when the user does not exist', () => {
    before(() => {
      const MockUsersRepository = {
        remove: () => Promise.reject(new Error('NotFoundError'))
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits NOT_FOUND with the error', (done) => {
      deleteUser.on(deleteUser.outputs.NOT_FOUND, (response) => {
        expect(response.message).to.equal('NotFoundError');
        done();
      });

      deleteUser.execute(123);
    });
  });


  context('when there is an internal error', () => {
    before(() => {
      const MockUsersRepository = {
        remove: () => Promise.reject(new Error('Some Error'))
      };

      deleteUser = new DeleteUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      deleteUser.on(deleteUser.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Some Error');
        done();
      });

      deleteUser.execute(321);
    });
  });
});
