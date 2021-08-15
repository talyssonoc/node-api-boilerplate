const makeContext = <T extends Record<string, any>>(context: T) => ({
  initFunction: <F extends (arg: T) => Promise<void>>(fn: F) => fn,
  initializer: async <F extends (arg: T) => Promise<void>>(...fns: F[]): Promise<void> => {
    await fns.reduce((promise: Promise<any>, fn: F) => promise.then(() => fn(context)), Promise.resolve());
  },
  context,
});

export { makeContext };
