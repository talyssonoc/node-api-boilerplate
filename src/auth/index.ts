import { makeModule } from '@/context';
import { withMongoProvider } from '@/_lib/MongoProvider';
import { toContainerValues } from '@/_lib/di/containerAdapters';
import { asFunction } from 'awilix';
import { makeMongoUserRepository } from '@/auth/infrastructure/MongoUserRepository';
import { initUserCollection, UserCollection } from '@/auth/infrastructure/UserCollection';
import { UserRepository } from '@/auth/domain/UserRepository';

const authModule = makeModule('auth', async ({ container: { register }, initialize }) => {
  const [collections] = await initialize(
    withMongoProvider({
      userCollection: initUserCollection,
    })
  );

  register({
    ...toContainerValues(collections),
    userRepository: asFunction(makeMongoUserRepository),
  });
});

type AuthRegistry = {
  userCollection: UserCollection;
  userRepository: UserRepository;
};

export { authModule };
export type { AuthRegistry };
