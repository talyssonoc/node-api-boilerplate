const request = require('test/support/request');
const factory = require('test/support/factory');

describe('API :: GET /api/users/:id', () => {
  describe('when user exists', () => {
    test('returns the user and status 200', async () => {
      const user = await factory.create('user', {
        name: 'The User'
      });

      const { body } = await request()
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(body.id).toBe(user.id);
      expect(body.name).toBe('The User');
    });
  });

  describe('when user does not exist', () => {
    test('returns a not found error and status 404', async () => {
      const { body } = await request()
        .get('/api/users/0')
        .expect(404);

      expect(body.type).toBe('NotFoundError');
      expect(body.details).toBe('User with id 0 can\'t be found.');
    });
  });
});
