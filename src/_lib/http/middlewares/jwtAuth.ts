import { asValue } from 'awilix';
import { RequestHandler } from 'express';
import { PublicKey } from '@/_lib/security/PublicKey';
import { expressjwt } from 'express-jwt';

type JwtAuthProps = {
  publicKey: PublicKey;
};

const jwtAuth = ({ publicKey }: JwtAuthProps): RequestHandler[] => [
  expressjwt({
    secret: publicKey,
    algorithms: ['ES256', 'ES512', 'RS256', 'RS512'],
    credentialsRequired: false,
    requestProperty: 'token',
  }),
  ({ container, token: { credentials = null } = {} }, _, next) => {
    container.register({
      credentials: asValue(credentials),
    });

    next();
  },
];

export { jwtAuth };
