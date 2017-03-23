const { expect } = require('chai');
const GetAllUsers = require('src/app/user/GetAllUsers');

describe('App :: User :: GetAllUsers', () => {
  var getAllUsers;

  context('when query is successful', () => {
    before(() => {
      const MockUsersRepository = {
        getAll: () => Promise.resolve('Imagine all the users...')
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository
      });
    });

    it('emits SUCCESS with all the users', (done) => {
      getAllUsers.on(getAllUsers.outputs.SUCCESS, (response) => {
        expect(response).to.equal('Imagine all the users...');
        done();
      });

      getAllUsers.execute();
    });
  });

  context('when there is an internal error', () => {
    before(() => {
      const MockUsersRepository = {
        getAll: () => Promise.reject(new Error('Failed'))
      };

      getAllUsers = new GetAllUsers({
        usersRepository: MockUsersRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      getAllUsers.on(getAllUsers.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Failed');

        done();
      });

      getAllUsers.execute();
    });
  });
});
