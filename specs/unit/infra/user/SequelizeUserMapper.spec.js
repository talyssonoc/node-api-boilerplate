
const User = require('src/domain/user/User');
const SequelizeUserMapper = require('src/infra/user/SequelizeUserMapper');

describe('Infra :: User :: SequelizeUserMapper', () => {
  describe('.toEntity', () => {
    test('returns user instance with passed attributes', () => {
      const mockedSequelizeUser = {
        dataValues: {
          id: 1,
          name: 'The Name',
        },
      };

      const entity = SequelizeUserMapper.toEntity(mockedSequelizeUser);

      expect(entity).toBeInstanceOf(User);
      expect(entity.id).toEqual(1);
      expect(entity.name).toEqual('The Name');
    });
  });

  describe('.toDatabase', () => {
    test('returns user object prepared to be persisted', () => {
      const user = new User({
        name: 'Some User',
      });

      const dbUser = SequelizeUserMapper.toDatabase(user);

      expect(dbUser.name).toEqual('Some User');
    });
  });
});
