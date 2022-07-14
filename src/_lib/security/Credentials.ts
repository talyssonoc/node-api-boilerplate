import { makeWithInvariants } from '../WithInvariants';

namespace Credentials {
  type Credentials<M extends Record<string, any> = Record<string, any>, R = string> = Readonly<{
    principalId: string;
    role: R[];
    meta: M;
    emittedAt?: Date;
  }>;

  const withInvariants = makeWithInvariants<Credentials>((self, assert) => {
    assert(self.meta, 'Credentials metadata is obligatory');
  });

  type CredentialsProps<M extends Record<string, any> = Record<string, any>, R = string> = Readonly<{
    principalId: string;
    role: R[];
    meta: M;
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
