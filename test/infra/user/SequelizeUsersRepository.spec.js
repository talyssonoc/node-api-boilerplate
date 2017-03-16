const { expect } = require('chai');
const factory = require('test/support/factory');
const SequelizeUsersRepository = require('src/infra/user/SequelizeUsersRepository');
const User = require('src/domain/user/User');
const { User: UserModel } = require('src/infra/database/models');

describe('Infra :: User :: SequelizeUsersRepository', () => {
  describe('#getAll', () => {
    it('returns all users from the database', () => {
      const repository = new SequelizeUsersRepository({ UserModel });

      return factory
        .createMany('user', [
          { name: 'User 1' },
          { name: 'User 2' }
        ])
        .then(() => repository.getAll())
        .then((users) => {
          expect(users).to.have.lengthOf(2);

          expect(users[0]).to.be.instanceOf(User);
          expect(users[0].name).to.equal('User 1');

          expect(users[1]).to.be.instanceOf(User);
          expect(users[1].name).to.equal('User 2');
        });
    });
  });

  describe('#add', () => {
    context('when user is valid', () => {
      it('persists the user', () => {
        const repo  = new SequelizeUsersRepository({ UserModel });

        const user = new User({
          name: 'The User'
        });

        expect(user.validate().valid).to.be.ok();

        return expect(() => {
          return repo.add(user)
            .then((persistedUser) => {
              expect(persistedUser.id).to.exist;
              expect(persistedUser.name).to.equal('The User');
            });
        }).to.alter(() => repo.count(), { by: 1 });
      });
    });
  });
});
