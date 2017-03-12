const request = require('test/support/request');
const { expect } = require('chai');

describe('API :: POST /users', () => {
  context('when sent data is ok', () => {
    it('creates and returns 200 and the new user', () => {
      return request()
        .post('/users')
        .send({
          name: 'New User'
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.id).to.exist;
          expect(body.name).to.equal('New User');
          expect(body).to.have.all.keys('id', 'name');
        });
    });
  });

  context('when name is missing', () => {
    it('does not create and returns 400 with the validation error', () => {
      return request()
        .post('/users')
        .expect(400)
        .then(({ body }) => {
          expect(body.type).to.equal('ValidationError');
          expect(body.details).to.have.lengthOf(1);
          expect(body.details[0].message).to.equal('"name" is required');
        });
    });
  });
});
