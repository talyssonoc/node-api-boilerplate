const request = require('test/support/request');
const factory = require('test/support/factory');

describe('API :: GET /api/users', () => {
  describe('when there are users', () => {
    beforeEach(async () => {
      return await factory.createMany('user', 2, [
        { name: 'First' },
        { name: 'Second' }
      ]);
    });

    test('return success with array of users', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).toHaveLength(2);

      expect(body[0].name).toBe('First');
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');

      expect(body[1].name).toBe('Second');
      expect(body[1]).toHaveProperty('id');
      expect(body[1]).toHaveProperty('name');
    });
  });

  describe('when there are no users', () => {
    test('return success with empty array', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).toHaveLength(0);
    });
  });
});
