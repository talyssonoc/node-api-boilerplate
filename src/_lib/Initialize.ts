type InitFn<R, T, OPTS = void> = (deps: R, opts?: OPTS) => T;
type BuilderFn<R, OPTS = void> = <T>(fn: InitFn<R, T, OPTS>) => T;
type ThenArg<T extends (...args: any[]) => Promise<any>> = ReturnType<T> extends PromiseLike<infer U>
  ? U
  : ReturnType<T>;

type Initialize<R, OPTS = void> = <T extends Array<InitFn<R, unknown, OPTS>>>(
  ...fns: T
) => Promise<{ [i in keyof T]: T[i] extends (...args) => any ? ThenArg<T[i]> : T[i] }>;

const makeInitialize =
  <R extends Record<string, any>, OPTS = void>(builderFn: BuilderFn<R, OPTS>): Initialize<R, OPTS> =>
  <T extends Array<InitFn<R, unknown, OPTS>>>(
    ...fns: T
  ): Promise<{ [i in keyof T]: T[i] extends (...args) => any ? ThenArg<T[i]> : T[i] }> =>
    fns.reduce(
      (chain, fn) =>
        chain.then((results) => Promise.resolve(builderFn(fn)).then((result) => Promise.resolve([...results, result]))),
      Promise.resolve<any[]>([])
    ) as any;

export { makeInitialize };
export type { Initialize };
