import { makeModule } from '@/context';
import { withMongoProvider } from '@/_lib/MongoProvider';
import { toContainerValues } from '@/_lib/di/containerAdapters';
import { asFunction } from 'awilix';
import { makeMongoUserRepository } from './infrastructure/MongoUserRepository';
import { initUserCollection, UserCollection } from './infrastructure/UserCollection';
import { CreateUser, makeCreateUser } from './application/useCases/CreateUser';
import { makeAuthController } from './interface/http/authController';
import { UserRepository } from './domain/UserRepository';
import { Authenticate, makeAuthenticate } from './application/useCases/Authenticate';
import { makeJWTSignerService } from './infrastructure/JWTSignerService';
import { SecurityBooth } from '@/_lib/security';
import { KeyPair, makeKeyPair } from '@/_lib/certificates';

const authModule = makeModule('auth', async ({ container: { register, build } }) => {
  const collections = await build(
    withMongoProvider({
      userCollection: initUserCollection,
    })
  );

  //registrar o signer
  //registrar o keyPair e verifier no security.ts no boot
  register({
    ...toContainerValues(collections),
    userRepository: asFunction(makeMongoUserRepository),
    createUser: asFunction(makeCreateUser),
    signerService: asFunction(makeJWTSignerService),
    authenticate: asFunction(makeAuthenticate),
    keyPair: asFunction(makeKeyPair), //isso fica aqui msm?
  });

  build(makeAuthController);
});

type AuthRegistry = {
  userCollection: UserCollection;
  userRepository: UserRepository;
  createUser: CreateUser;
  signerService: SecurityBooth;
  authenticate: Authenticate;
  keyPair: KeyPair; //isso fica aqui mesmo?
};

export { authModule };
export type { AuthRegistry };
