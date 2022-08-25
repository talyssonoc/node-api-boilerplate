import { makePrivateKey, PrivateKey } from './PrivateKey';
import { makePublicKey, PublicKey } from './PublicKey';
import { logger } from '../logger';

type KeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};

type KeyPairConfig = {
  keyPair: {
    publicKey: string;
    privateKey: string;
    passphrase?: string;
  };
};

type Dependencies = {
  config: KeyPairConfig;
};

const makeKeyPair = ({ config }: Dependencies): KeyPair => {
  let publicKey: PublicKey;
  let privateKey: PrivateKey;

  try {
    privateKey = makePrivateKey(config.keyPair);
  } catch (err) {
    logger.error({ message: '[KeyPair] Unable to load private key', err });
    throw err;
  }

  try {
    publicKey = makePublicKey(config.keyPair);
  } catch (err) {
    logger.error({ message: '[KeyPair] Unable to load public key', err });
    throw err;
  }

  return {
    publicKey,
    privateKey,
  };
};

export { makeKeyPair };
export type { KeyPairConfig, KeyPair };
