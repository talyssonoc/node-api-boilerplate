const User = require('src/domain/user/User');

describe('Domain :: User', () => {
  describe('#isLegal', () => {
    describe('when user is younger than 21', () => {
      test('returns false', () => {
        const user = new User({ age: 20 });

        expect(user.isLegal()).toBe(false);
      });
    });

    describe('when user is 21 years old', () => {
      test('returns true', () => {
        const user = new User({ age: 21 });

        expect(user.isLegal()).toBe(true);
      });
    });
  });
});
