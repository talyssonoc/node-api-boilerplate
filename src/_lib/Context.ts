import { Lifecycle } from "@/_lib/Lifecycle";
import { Application, HookFn, makeApp } from "@/_lib/Application";

type EntrypointFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void>;

type BootFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void | HookFn>;

type Module<F extends BootFn<any>> = {
  name: string;
  fn: F;
};

type BaseContext<T extends Record<string | symbol, any>> = {
  app: Omit<Application, "start">;
  bootstrap: <M extends Module<BootFn<T>>[]>(...modules: M) => Promise<void>;
} & T;

type Context<T extends Record<string | symbol, any>> = {
  makeModule: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F) => M;
  withContext: <F extends EntrypointFn<T>>(fn: F) => () => Promise<void>;
};

type ContextOptions = {
  shutdownTimeout: number;
  logger: Pick<Console, "info" | "error">;
};

const defaultOptions: ContextOptions = {
  shutdownTimeout: 5000,
  logger: console,
};

const makeContext = <T extends Record<string | symbol, any>>(
  localContext: T,
  opts: Partial<ContextOptions> = {}
): Context<T> => {
  const { shutdownTimeout, logger } = { ...defaultOptions, ...opts };
  const moduleKey = Symbol();

  const app = makeApp({ shutdownTimeout, logger });

  const bootstrap = async <M extends Module<BootFn<T>>[]>(...modules: M): Promise<void> => {
    if (!modules.every((module) => module[moduleKey])) {
      const foreignModules = modules.filter((module) => !module[moduleKey]).map((module) => module.name);
      throw new Error(`Foreign module(s) provided for bootstrap function: ${foreignModules.join(", ")}`);
    }

    const bootOrder = modules.map(({ name, fn }) => async () => {
      logger.info(`Bootstraping ${name} module.`);

      const result = await fn(
        Object.freeze({
          ...context,
          app: {
            ...app,
            once: (lifecycle: Lifecycle, fn: HookFn, order = "append") => {
              app.once(lifecycle, async () => {
                logger.info(`Running ${lifecycle.toLowerCase()} hook for module ${name}.`);

                return fn().catch((err) => {
                  logger.error(`Error while performing ${lifecycle.toLowerCase()} hook for ${name} module.`);
                  logger.error(err);
                });
              }, order);
            },
          },
        })
      );

      if (typeof result === "function") {
        app.once(
          Lifecycle.SHUTTING_DOWN,
          async () => {
            logger.info(`Disposing of ${name} module.`);

            return result().catch((err) => {
              logger.error(`Error while disposing of ${name} module. Trying to resume teardown`);
              logger.error(err);
            });
          },
          "prepend"
        );
      }
    });

    app.once(Lifecycle.BOOTING, bootOrder);

    return app.start();
  };


  const context: BaseContext<T> = {
    ...localContext,
    app,
    bootstrap
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
