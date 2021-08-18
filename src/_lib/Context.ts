import { Lifecycle } from "@/_lib/Lifecycle";
import { Application, makeApp } from "@/_lib/Application";

type EntrypointFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void>;

type BootFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void | HookFn>;

type BaseContext<T extends Record<string | symbol, any>> = {
  app: Application;
  once: (lifecycle: Lifecycle, fn: () => Promise<void>) => void;
  bootstrap: <M extends Module<BootFn<T>>[]>(...modules: M) => Promise<void>;
  terminate: () => void;
  teardown: () => Promise<void>;
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


const moduleChain = <M extends Module<any>[]>(modules: M, handler: (module: M[number]) => () => Promise<void>) => {
  return modules.reduce((chain, module) => chain.then(handler(module)), Promise.resolve());
};

const makeContext = <T extends Record<string | symbol, any>>(
  localContext: T,
  opts: Partial<ContextOptions> = {}
): Context<T> => {
  const { shutdownTimeout, logger } = { ...defaultOptions, ...opts };
  const moduleKey = Symbol();

  const app = makeApp();

  app.once(Lifecycle.BOOTED, async () => {
    await moduleChain(({ name, fn }) => () => {
      logger.info(`Running post-boot hook for ${name} module.`);

      return fn().catch((err) => {
        logger.error(`Error while performing post-boot for ${name} module.`);
        logger.error(err);
      });
    });
  });

  const teardown = async () => {
    app.stop();

    await moduleChain(hooks.get(Lifecycle.SHUTTING_DOWN), ({ name, fn }) => () => {
      logger.info(`Running pre-shutdown hook for ${name} module.`);

      return fn().catch((err) => {
        logger.error(`Error while performing pre-shutdown for ${name} module.`);
        logger.error(err);
      });
    });

    await moduleChain(cleanUpFns, ({ name, fn }) => () => {
      logger.info(`Disposing of ${name} module.`);

      return fn().catch((err) => {
        logger.error(`Error while disposing of ${name} module. Trying to resume teardown`);
        logger.error(err);
      });
    });
  };

  const shutdown = async () => {
    logger.info("Terminating application");

    const { timeout } = await Promise.race([teardown().then(() => ({ timeout: false })), wait(shutdownTimeout)]);

    if (timeout) {
      logger.error("Ok, my patience is over! #ragequit");
      process.exit(1);
    }

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  const bootstrap = async <M extends Module<BootFn<T>>[]>(...modules: M): Promise<void> => {
    if (!modules.every((module) => module[moduleKey])) {
      const foreignModules = modules.filter((module) => !module[moduleKey]).map((module) => module.name);
      throw new Error(`Foreign module(s) provided for bootstrap function: ${foreignModules.join(", ")}`);
    }

    app.once(Lifecycle.BOOTING, () => await moduleChain(modules, ({ name, fn }) => async () => {
      logger.info(`Bootstraping ${name} module.`);

      const once = async () => {

      }
      }

      const result = await fn(Object.freeze({ ...context, app, once:  }));

      if (typeof result === "function") {
        cleanUpFns = [{ name, fn: result }, ...cleanUpFns];
      }
    }));

  const terminate = () => process.kill(process.pid, "SIGTERM");

  const context: BaseContext<T> = {
    ...localContext,
    app,
    bootstrap,
    terminate,
    teardown,
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
