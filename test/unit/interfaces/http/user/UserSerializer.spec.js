const { expect } = require('chai');
const UserSerializer = require('src/interfaces/http/user/UserSerializer');
const User = require('src/domain/user/User');

describe('Interfaces :: HTTP :: User :: UserSerializer', () => {
  it('returns id and name', () => {
    const serializedUser = UserSerializer.serialize({
      id: 123,
      name: 'The User'
    });

    expect(serializedUser).to.eql({
      id: 123,
      name: 'The User'
    });
  });

  it('ignores extra attributes', () => {
    const serializedUser = UserSerializer.serialize({
      id: 321,
      name: 'The User',
      unknown: 'Hello!'
    });

    expect(serializedUser).to.eql({
      id: 321,
      name: 'The User'
    });
  });

  it('is able to serialize user entity instances', () => {
    const user = new User({ id: 1, name: 'User :)' });
    const serializedUser = UserSerializer.serialize(user);

    expect(serializedUser).to.eql({
      id: 1,
      name: 'User :)'
    });
  });
});
