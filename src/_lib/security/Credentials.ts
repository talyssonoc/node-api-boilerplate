import { makeWithInvariants } from '@/_lib/WithInvariants';

namespace Credentials {
  type Credentials = Readonly<{
    principalId: string;
    roles: string[];
    meta?: Record<string, any>;
    emittedAt?: Date;
  }>;

  const withInvariants = makeWithInvariants<Credentials>((self, assert) => {
    assert(self.principalId, 'Credentials principalId is mandatory');
    assert(self.roles.length, 'Credentials should have at least one role');
  });

  type CredentialsProps = Readonly<{
    principalId: string;
    roles: string[];
    meta?: Record<string, any>;
  }>;

  export const create = withInvariants(
    (props: CredentialsProps): Credentials => ({
      principalId: props.principalId,
      roles: props.roles,
      meta: props.meta,
      emittedAt: new Date(),
    })
  );

  export type Type = Credentials;
}

export { Credentials };
