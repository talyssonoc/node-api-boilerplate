const { expect } = require('chai');
const User = require('src/domain/user/User');

describe('Domain :: User', () => {
  describe('#getInitial', () => {
    context('when user has a name', () => {
      it('returns first char of the name', () => {
        const user = new User({ name: 'Thing' });

        expect(user.getInitial()).to.equal('T');
      });
    });

    context('when user has no name', () => {
      it('returns empty string', () => {
        const user = new User();

        expect(user.getInitial()).to.equal('');
      });
    });
  });
});
