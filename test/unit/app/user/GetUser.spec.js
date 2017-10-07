const { expect } = require('chai');
const GetUser = require('src/app/user/GetUser');

describe('App :: User :: GetUser', () => {
  let getUser;

  context('when user exists', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        getById: (userId) => Promise.resolve({
          id: userId,
          name: 'The User'
        })
      };

      getUser = new GetUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits SUCCESS with the user', (done) => {
      getUser.on(getUser.outputs.SUCCESS, (user) => {
        expect(user.id).to.equal(123);
        expect(user.name).to.equal('The User');
        done();
      });

      getUser.execute(123);
    });
  });

  context('when user does not exist', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        getById: () => Promise.reject({
          details: 'User with id 123 can\'t be found.'
        })
      };

      getUser = new GetUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits NOT_FOUND with the error', (done) => {
      getUser.on(getUser.outputs.NOT_FOUND, (error) => {
        expect(error.details).to.equal('User with id 123 can\'t be found.');
        done();
      });

      getUser.execute(123);
    });
  });
});
