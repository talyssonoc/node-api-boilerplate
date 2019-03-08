const request = require('specs/support/request');


describe('API :: POST /api/users', () => {
  describe('when sent data is ok', () => {
    test('creates and returns 201 and the new user', async () => {
      const { body } = await request()
        .post('/api/users')
        .send({
          name: 'New User',
        })
        .expect(201);

      expect(body.id).toBeDefined();
      expect(body.name).toEqual('New User');
      expect(body.id).toBeDefined();
    });
  });

  describe('when name is missing', () => {
    test('does not create and returns 400 with the validation error', async () => {
      const { body } = await request()
        .post('/api/users')
        .expect(400);

      expect(body.type).toEqual('ValidationError');
      expect(body.details).toHaveLength(1);
      expect(body.details[0].message).toEqual('"name" is required');
    });
  });
});
