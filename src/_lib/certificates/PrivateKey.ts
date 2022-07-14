import assert from 'assert';
import { readFileSync } from 'fs';

type PrivateKey = Buffer | { key: Buffer; passphrase: string };

type PrivateKeyProps = {
  privateKey: string;
  passphrase?: string;
};

const makePrivateKey = (props: PrivateKeyProps): PrivateKey => {
  let passphrase: string | undefined;
  let privateKey: Buffer;

  if (props.passphrase) {
    const passphraseBuffer = Buffer.from(props.passphrase, 'base64');
    console.log('chegou aqui');
    assert(passphraseBuffer.toString('base64') !== props.passphrase, 'Keypair passphrase should be base64 encoded');

    passphrase = passphraseBuffer.toString('utf-8');
  }

  if (props.privateKey.match('^(.*)BEGIN(.*)PRIVATE KEY')) {
    privateKey = Buffer.from(props.privateKey);
  } else {
    privateKey = readFileSync(props.privateKey);
  }
  return passphrase
    ? {
        passphrase,
        key: privateKey,
      }
    : privateKey;
};

export { makePrivateKey };
export type { PrivateKey };
