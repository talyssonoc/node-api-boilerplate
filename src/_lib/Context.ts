import { Application, HookFn, makeApp } from '@/_lib/Application';

type EntrypointFn<T extends Record<string | symbol, any>> = (arg: Context<T>) => Promise<void>;

type BootFn<T extends Record<string | symbol, any>> = (arg: Context<T>) => Promise<void | HookFn>;

type Module<T extends Record<string | symbol, any>, F extends BootFn<T> = BootFn<any>> = {
  name: string;
  fn: F;
};

type Context<T extends Record<string | symbol, any>> = {
  app: Omit<Application, 'start' | 'onBooting'>;
  bootstrap: <M extends Module<T>[]>(...modules: M) => Promise<void>;
} & T;

type ContextProvider<T extends Record<string | symbol, any>> = {
  makeModule: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F) => M;
  withContext: <F extends EntrypointFn<T>>(fn: F) => () => Promise<void>;
};

type ContextOptions = {
  shutdownTimeout: number;
  logger: Pick<Console, 'info' | 'error' | 'warn'>;
};

const defaultOptions: ContextOptions = {
  shutdownTimeout: 5000,
  logger: console,
};

const makeContext = <T extends Record<string | symbol, any>>(
  localContext: T,
  opts: Partial<ContextOptions> = {}
): ContextProvider<T> => {
  const { shutdownTimeout, logger } = { ...defaultOptions, ...opts };
  const moduleKey = Symbol();

  const app = makeApp({ shutdownTimeout, logger });

  const bootstrap = async <M extends Module<T>[]>(...modules: M): Promise<void> => {
    if (!modules.every((module) => module[moduleKey])) {
      const foreignModules = modules.filter((module) => !module[moduleKey]).map((module) => module.name);
      throw new Error(`Foreign module(s) provided for bootstrap function: ${foreignModules.join(', ')}`);
    }

    const bootOrder = modules.map(({ name, fn }) => async () => {
      logger.info(`Bootstraping ${name} module.`);

      const result = await fn(
        Object.freeze({
          ...context,
          app: app.decorateHooks((lifecycle, fn) => async () => {
            const isArray = Array.isArray(fn);

            logger.info(`Running ${lifecycle.toLowerCase()} hook${isArray ? 's' : ''} from ${name} module.`);

            return (Array.isArray(fn) ? fn : [fn]).reduce(
              (chain, hook) =>
                chain.then(() =>
                  hook().catch((err) => {
                    logger.error(
                      `Error while performing ${lifecycle.toLowerCase()} hook${isArray ? 's' : ''} from ${name} module.`
                    );
                    logger.error(err);
                  })
                ),
              Promise.resolve()
            );
          }),
        })
      );

      if (typeof result === 'function') {
        app.onDisposing(async () => {
          logger.info(`Disposing ${name} module.`);

          return result().catch((err) => {
            logger.error(`Error while disposing of ${name} module. Trying to resume teardown`);
            logger.error(err);
          });
        }, 'prepend');
      }
    });

    app.onBooting(bootOrder);

    return app.start();
  };

  const context: Context<T> = {
    ...localContext,
    app,
    bootstrap,
  };

  return {
    makeModule: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F): M =>
      ({
        [moduleKey]: true,
        name,
        fn,
      } as unknown as M),
    withContext:
      <F extends EntrypointFn<T>>(fn: F): (() => Promise<void>) =>
      () =>
        fn(Object.freeze(context)),
  };
};

export { makeContext };
