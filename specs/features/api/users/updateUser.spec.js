const request = require('specs/support/request');
const factory = require('specs/support/factory');


describe('API :: PUT /api/users/:id', () => {
  describe('when user exists', () => {
    describe('when sent data is ok', () => {
      test('updates and returns 202 with the updated user', async () => {
        const user = await factory.create('user', {
          name: 'User',
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            name: 'Updated User',
          })
          .expect(202);

        expect(body.id).toEqual(user.id);
        expect(body.name).toEqual('Updated User');
      });
    });

    describe('when name is empty', () => {
      test('does update and returns 400 with the validation error', async () => {
        const user = await factory.create('user', {
          name: 'User',
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            name: '',
          })
          .expect(400);

        expect(body.type).toEqual('ValidationError');
        expect(body.details).toHaveLength(1);
        expect(body.details[0].message).toEqual('"name" is not allowed to be empty');
      });
    });
  });

  describe('when user does not exist', () => {
    test('returns the not found message and status 404', async () => {
      const { body } = await request()
        .put('/api/users/0')
        .send({
          name: 'Updated User',
        })
        .expect(404);

      expect(body.type).toEqual('NotFoundError');
      expect(body.details).toEqual('User with id 0 can\'t be found.');
    });
  });
});
