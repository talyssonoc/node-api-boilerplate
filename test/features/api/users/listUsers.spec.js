const request = require('test/support/request');
const factory = require('test/support/factory');
const { expect } = require('chai');

describe('API :: GET /api/users', () => {
  context('when there are users', () => {
    beforeEach(() => {
      return factory.createMany('user', 2, [
        { name: 'First' },
        { name: 'Second' }
      ]);
    });

    it('return success with array of users', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).to.have.lengthOf(2);

      expect(body[0].name).to.equal('First');
      expect(body[0]).to.have.all.keys('id', 'name');

      expect(body[1].name).to.equal('Second');
      expect(body[1]).to.have.all.keys('id', 'name');
    });
  });

  context('when there are no users', () => {
    it('return success with empty array', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).to.have.lengthOf(0);
    });
  });
});
