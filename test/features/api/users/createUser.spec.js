const request = require('test/support/request');

describe('API :: POST /api/users', () => {
  describe('when sent data is ok', () => {
    test('creates and returns 201 and the new user', async () => {
      const { body } = await request()
        .post('/api/users')
        .send({
          name: 'New User'
        })
        .expect(201);

      expect(body.id).toBeDefined();
      expect(body.name).toBe('New User');
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
    });
  });

  describe('when name is missing', () => {
    test('does not create and returns 400 with the validation error', async () => {
      const { body } = await request()
        .post('/api/users')
        .expect(400);

      expect(body.type).toBe('ValidationError');
      expect(body.details).toHaveLength(1);
      expect(body.details[0].message).toBe('"name" is required');
    });
  });
});
