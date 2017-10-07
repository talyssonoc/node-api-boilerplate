const request = require('test/support/request');
const factory = require('test/support/factory');
const { expect } = require('chai');

describe('API :: DELETE /api/users/:id', () => {
  context('when user exists', () => {
    it('deletes the user and return status 202', async () => {
      const user = await factory.create('user', {
        name: 'User'
      });

      await request()
        .delete(`/api/users/${user.id}`)
        .expect(202);
    });
  });

  context('when user does not exist', () => {
    it('returns the not found message and status 404', async () => {
      const { body } = await request()
        .delete('/api/users/0')
        .send({
          name: 'Updated User'
        })
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 0 can\'t be found.');
    });
  });
});
