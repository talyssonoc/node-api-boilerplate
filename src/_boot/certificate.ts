// EM DESENVOLVIMENTO
type CertificateConfig = {
  certificate: {
    publicKey: string;
  };
};
//vai ter keypair e verifier aqui
// no auth vai ter só o sign
const certificate = makeModule('certificate', async ({ container: { register }, config }) => {
  const publicKey = makePublicKey(config.certificate);

  register({
    publicKey: asValue(publicKey),
    verifier: asFunction(makeSecurityPassVerifier),
  });
});

type CertificateRegistry = {
  publicKey: PublicKey;
  verifier: Verifier;
};

export { certificate };
export type { CertificateConfig, CertificateRegistry };
