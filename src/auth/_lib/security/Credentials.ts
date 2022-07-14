import { UnauthorizedError } from '@/_lib/errors/UnauthorizedError';
import { Credentials } from '@/_lib/security';
//pode ir pro sharedKernel
type WriterCredentials = Credentials.Type<
  {
    writerId: string;
  },
  'writer'
>;

const ensureRole: (credentials: unknown) => asserts credentials is WriterCredentials = (credentials: any) => {
  const isWriterCreds = credentials && credentials.role === 'writer';

  if (!isWriterCreds) {
    throw UnauthorizedError.create();
  }
};

export { ensureRole };
