const factory = require('test/support/factory');
const SequelizeUsersRepository = require('src/infra/user/SequelizeUsersRepository');
const User = require('src/domain/user/User');
const { User: UserModel } = require('src/infra/database/models');

describe('Infra :: User :: SequelizeUsersRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new SequelizeUsersRepository({ UserModel });
  });

  describe('#getAll', () => {
    beforeEach(async () => {
      return await factory.createMany('user', 2, [
        { name: 'User 1' },
        { name: 'User 2' }
      ]);
    });

    test('returns all users from the database', async () => {
      const users = await repository.getAll();

      expect(users).toHaveLength(2);

      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].name).toBe('User 1');

      expect(users[1]).toBeInstanceOf(User);
      expect(users[1].name).toBe('User 2');
    });
  });

  describe('#getById', () => {
    describe('when user exists', () => {
      test('returns the user', async () => {
        const user = await factory.create('user', {
          name: 'User'
        });

        const foundUser = await repository.getById(user.id);

        expect(foundUser).toBeInstanceOf(User);
        expect(foundUser.id).toBe(user.id);
        expect(foundUser.name).toBe('User');
      });
    });

    describe('when the user does not exist', () => {
      test('rejects with an error', async () => {
        try {
          await repository.getById(0);
        } catch(error) {
          expect(error.message).toBe('NotFoundError');
          expect(error.details).toBe('User with id 0 can\'t be found.');
        }
      });
    });
  });

  describe('#add', () => {
    describe('when user is valid', () => {
      test('persists the user', async () => {
        const user = new User({
          name: 'The User'
        });
        const initialCount = await repository.count();

        expect(user.validate().valid).toBeTruthy();

        const persistedUser = await repository.add(user);

        expect(persistedUser.id).toBeDefined();
        expect(persistedUser.name).toBe('The User');
        expect(await repository.count()).toBe(initialCount + 1);
      });
    });

    describe('when user is invalid', () => {
      test('does not persist the user and rejects with an error', async () => {
        const user = new User();
        const initialCount = await repository.count();

        expect(user.validate().valid).toBeFalsy();

        try {
          await repository.add(user);
        } catch(error) {
          expect(error.message).toBe('ValidationError');
          expect(error.details).toEqual([
            { message: '"name" is required', path: 'name' }
          ]);
          expect(await repository.count()).toBe(initialCount);
        }
      });
    });
  });

  describe('#remove', () => {
    describe('when the user exists', () => {
      test('removes the user', async () => {
        const user = await factory.create('user', {
          name: 'User'
        });

        const initialCount = await repository.count();

        await repository.remove(user.id);

        expect(await repository.count()).toBe(initialCount - 1);
      });
    });

    describe('when the user does not exist', () => {
      test('returns an error', async () => {
        try {
          await repository.remove(0);
        } catch(error) {
          expect(error.message).toBe('NotFoundError');
          expect(error.details).toBe('User with id 0 can\'t be found.');
        }
      });
    });
  });

  describe('#update', () => {
    describe('when the user exists', () => {
      describe('when data is valid', () => {
        test('updates and returns the updated user', async () => {
          const user = await factory.create('user', {
            name: 'User'
          });

          await repository.update(user.id, { name: 'New User' });
          const dbUser = await UserModel.findById(user.id);

          expect(dbUser.name).toBe('New User');
        });
      });

      describe('when data is not valid', () => {
        test('does not update and returns the error', async () => {
          const user = await factory.create('user', {
            name: 'User'
          });

          try {
            await repository.update(user.id, { name: '' });
          } catch(error) {
            expect(error.message).toBe('ValidationError');
          }

          const dbUser = await UserModel.findById(user.id);
          expect(dbUser.name).toBe('User');
        });
      });
    });

    describe('when the user does not exist', () => {
      test('returns an error', async () => {
        try {
          await repository.update(0, { name: 'New User' });
        } catch(error) {
          expect(error.message).toBe('NotFoundError');
          expect(error.details).toBe('User with id 0 can\'t be found.');
        }
      });
    });
  });
});
