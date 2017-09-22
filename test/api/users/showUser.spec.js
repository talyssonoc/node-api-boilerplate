const request = require('test/support/request');
const factory = require('test/support/factory');
const { expect } = require('chai');

describe('API :: GET /api/users/:id', () => {
  context('when user exists', () => {
    it('returns the user and status 200', async () => {
      const user = await factory.create('user', {
        name: 'The User'
      });

      const { body } = await request()
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(body.id).to.equal(user.id);
      expect(body.name).to.equal('The User');
    });
  });

  context('when user does not exist', () => {
    it('returns a not found error and status 404', async () => {
      const { body } = await request()
        .get('/api/users/0')
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 0 can\'t be found.');
    });
  });
});
