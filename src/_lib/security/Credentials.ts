import { makeWithInvariants } from '@/_lib/WithInvariants';

namespace Credentials {
  type Credentials<M extends Record<string, any> = Record<string, any>, R = string> = Readonly<{
    principalId: string;
    role: R[];
    meta?: M;
    emittedAt?: Date;
  }>;

  const withInvariants = makeWithInvariants<Credentials>((self, assert) => {
    assert(self.principalId, 'Credentials principalId is mandatory');
    assert(self.role.length, 'Credentials should have at least one role');
  });

  type CredentialsProps<M extends Record<string, any> = Record<string, any>, R = string> = Readonly<{
    principalId: string;
    role: R[];
    meta?: M;
  }>;

  export const create = withInvariants(
    <M extends Record<string, any> = Record<string, any>, R = string>(
      props: CredentialsProps<M, R>
    ): Credentials<M, R> => ({
      principalId: props.principalId,
      role: props.role,
      meta: props.meta,
      emittedAt: new Date(),
    })
  );

  export type Type<M extends Record<string, any> = Record<string, any>, R = string> = Credentials<M, R>;
}

export { Credentials };
