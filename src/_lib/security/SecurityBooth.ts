import { Credentials } from './Credentials';

type SecurityPass = {
  token: string;
  emittedAt: Date;
  expiresAt: Date;
};

type Signer = (credentials: Credentials.Type) => Promise<SecurityPass>;

type Verifier = (token: string) => Promise<Credentials.Type>;

type SecurityBooth = {
  sign: Signer;
  verify: Verifier;
};

export { SecurityPass, Signer, Verifier, SecurityBooth };
