import { asValue } from 'awilix';
import { makeModule } from '@/context';
import { jwtAuth } from '@/_lib/http/middlewares/jwtAuth';
import { KeyPair, KeyPairConfig, makeKeyPair } from '@/_lib/security/KeyPair';
import { Credentials } from '@/_lib/security/Credentials';

type SecurityConfig = KeyPairConfig;

const security = makeModule('security', async ({ container: { register }, initialize }) => {
  const [keyPair] = await initialize(makeKeyPair);

  await initialize(async ({ apiRouter }) => {
    apiRouter.use(jwtAuth({ publicKey: keyPair.publicKey }));
  });

  register({
    keyPair: asValue(keyPair),
    credentials: asValue(null),
  });
});

type SecurityRegistry = {
  keyPair: KeyPair;
  credentials: Credentials.Type | null;
};

export { security };
export type { SecurityConfig, SecurityRegistry };
