const request = require('test/support/request');
const factory = require('test/support/factory');
const { expect } = require('chai');

describe('API :: PUT /api/users/:id', () => {
  context('when user exists', () => {
    context('when sent data is ok', () => {
      it('updates and returns 202 with the updated user', async () => {
        const user = await factory.create('user', {
          name: 'User'
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            name: 'Updated User'
          })
          .expect(202);

        expect(body.id).to.equal(user.id);
        expect(body.name).to.equal('Updated User');
      });
    });

    context('when name is empty', () => {
      it('does update and returns 400 with the validation error', async () => {
        const user = await factory.create('user', {
          name: 'User'
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            name: ''
          })
          .expect(400);

        expect(body.type).to.equal('ValidationError');
        expect(body.details).to.have.lengthOf(1);
        expect(body.details[0].message).to.equal('"name" is not allowed to be empty');
      });
    });
  });

  context('when user does not exist', () => {
    it('returns the not found message and status 404', async () => {
      const { body } = await request()
        .put('/api/users/0')
        .send({
          name: 'Updated User'
        })
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 0 can\'t be found.');
    });
  });
});
