import { Credentials } from '@/_lib/security/Credentials';
import { PrivateKey } from '@/_lib/security/PrivateKey';
import { PublicKey } from '@/_lib/security/PublicKey';
import { SecurityBooth, SecurityPass } from '@/_lib/security/SecurityBooth';
import assert from 'assert';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

const jwtAlgoritms = ['ES256', 'ES512', 'RS256', 'RS512'] as const;

type JWTAlgorithm = typeof jwtAlgoritms[number];

type JWTSignerConfig = {
  jwt: {
    ttl: number;
    algorithm: string;
  };
};

type KeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};

type Dependencies = {
  keyPair: KeyPair;
  config: JWTSignerConfig;
};

type TokenPayload = JwtPayload & {
  credentials: Credentials.Type;
};

const makeJWTSecurityBooth = ({ keyPair, config }: Dependencies): SecurityBooth => {
  assert(
    jwtAlgoritms.includes(config.jwt.algorithm as any),
    `jwt.algoritm should be one of ${jwtAlgoritms.join(', ')}`
  );

  assert(
    config.jwt.ttl > 0,
    `jwt.ttl should be a positive integer that represents the amount of seconds the jwt will be valid`
  );

  return {
    sign(credentials: Credentials.Type): Promise<SecurityPass> {
      const exp = Date.now() + config.jwt.ttl * 1000;

      const token = sign(
        {
          exp,
          credentials,
        },
        keyPair.privateKey,
        { algorithm: config.jwt.algorithm as JWTAlgorithm, subject: credentials.principalId }
      );

      return Promise.resolve({
        token,
        emittedAt: new Date(),
        expiresAt: new Date(exp),
      });
    },
    verify(token: string): Promise<Credentials.Type> {
      const { credentials } = verify(token, keyPair.publicKey) as TokenPayload;

      return Promise.resolve(credentials);
    },
  };
};

export { makeJWTSecurityBooth };
export type { JWTSignerConfig, JWTAlgorithm };
