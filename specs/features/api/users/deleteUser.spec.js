const request = require('specs/support/request');
const factory = require('specs/support/factory');


describe('API :: DELETE /api/users/:id', () => {
  describe('when user exists', () => {
    test('deletes the user and return status 202', async () => {
      const user = await factory.create('user', {
        name: 'User',
      });

      await request()
        .delete(`/api/users/${user.id}`)
        .expect(202);
    });
  });

  describe('when user does not exist', () => {
    test('returns the not found message and status 404', async () => {
      const { body } = await request()
        .delete('/api/users/0')
        .send({
          name: 'Updated User',
        })
        .expect(404);

      expect(body.type).toEqual('NotFoundError');
      expect(body.details).toEqual('User with id 0 can\'t be found.');
    });
  });
});
