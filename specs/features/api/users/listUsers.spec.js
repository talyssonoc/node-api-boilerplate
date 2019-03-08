const request = require('specs/support/request');
const factory = require('specs/support/factory');


describe('API :: GET /api/users', () => {
  describe('when there are users', () => {
    beforeEach(() => factory.createMany('user', 2, [
      { name: 'First' },
      { name: 'Second' },
    ]));

    test('return success with array of users', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).toHaveLength(2);

      expect(body[0].name).toEqual('First');
      expect(body[0].id).toBeDefined();


      expect(body[1].name).toEqual('Second');
      expect(body[1].id).toBeDefined();
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
