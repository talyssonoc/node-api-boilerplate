import { readFileSync } from 'fs';

type PublicKey = Buffer;

type PublicKeyProps = {
  publicKey: string;
};

const makePublicKey = (props: PublicKeyProps): PublicKey => {
  let publicKey: Buffer;

  if (props.publicKey.match('^(.*)BEGIN(.*)PUBLIC KEY')) {
    publicKey = Buffer.from(props.publicKey);
  } else {
    publicKey = readFileSync(props.publicKey);
  }

  return publicKey;
};

export { makePublicKey };
export type { PublicKey };
