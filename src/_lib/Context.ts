import EventEmitter from "events";
import { Lifecycle } from "@/_lib/Lifecycle";

type EntrypointFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void>;

type BootFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void | CleanupFn>;

type BaseContext<T extends Record<string | symbol, any>> = {
  app: EventEmitter;
  bootstrap: <M extends Module<BootFn<T>>[]>(...modules: M) => Promise<void>;
  terminate: () => void;
  teardown: () => Promise<void>;
} & T;

type Context<T extends Record<string | symbol, any>> = {
  makeModule: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F) => M;
  withContext: <F extends EntrypointFn<T>>(fn: F) => () => Promise<void>;
};

type CleanupFn = () => Promise<void>;

type ContextOptions = {
  shutdownTimeout: number;
  logger: Pick<Console, "info" | "error">;
};

type Module<F extends BootFn<any> | CleanupFn> = {
  name: string;
  fn: F;
};

const defaultOptions: ContextOptions = {
  shutdownTimeout: 5000,
  logger: console,
};

const wait = (timeout: number) =>
  new Promise<{ timeout: boolean }>(resolve => setTimeout(() => resolve({ timeout: true }), timeout));

const moduleChain = <M extends Module<any>[]>(modules: M, handler: (module: M[number]) => () => Promise<void>) => {
  return modules.reduce((chain, module) => chain.then(handler(module)), Promise.resolve());
};

const makeContext = <T extends Record<string | symbol, any>>(
  localContext: T,
  opts: Partial<ContextOptions> = {}
): Context<T> => {
  const { shutdownTimeout, logger } = { ...defaultOptions, ...opts };
  const moduleKey = Symbol();

  let cleanUpFns: Module<CleanupFn>[] = [];
  let appState: Lifecycle = Lifecycle.IDLE;

  const app = new EventEmitter();

  app.once(Lifecycle.BOOTED, () => {
    appState = Lifecycle.BOOTED;
  });

  app.once(Lifecycle.BOOTING, () => {
    appState = Lifecycle.BOOTING;
  });

  app.once(Lifecycle.SHUTTING_DOWN, () => {
    appState = Lifecycle.SHUTTING_DOWN;
  });

  const teardown = async () => {
    app.emit(Lifecycle.SHUTTING_DOWN);

    await moduleChain(cleanUpFns, ({ name, fn }) => () => {
      logger.info(`Disposing of ${name} module.`);

      return fn().catch(err => {
        logger.error(`Error while disposing of ${name} module. Trying to resume teardown`);
        logger.error(err);
      });
    });

    app.removeAllListeners();
  }

  const shutdown = async () => {
    logger.info("Terminating application");

    const { timeout } = await Promise.race([
      teardown().then(() => ({ timeout: false })),
      wait(shutdownTimeout),
    ]);

    if (timeout) {
      logger.error("Ok, my patience is over! #ragequit");
      process.exit(1);
    }

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  const bootstrap = async <M extends Module<BootFn<T>>[]>(...modules: M): Promise<void> => {
    if (appState !== Lifecycle.IDLE) throw new Error("The application has already started the bootstrap process.");

    if (!modules.every(module => module[moduleKey])) {
      const foreignModules = modules.filter(module => !module[moduleKey]).map(module => module.name);
      throw new Error(`Foreign module(s) provided for bootstrap function: ${foreignModules.join(", ")}`);
    }

    app.emit(Lifecycle.BOOTING);

    await moduleChain(modules, ({ name, fn }) => async () => {
      logger.info(`Bootstraping ${name} module.`);

      const result = await fn(context);

      if (typeof result === "function") {
        cleanUpFns = [{ name, fn: result }, ...cleanUpFns];
      }
    });

    app.emit(Lifecycle.BOOTED);
  };

  const terminate = () => process.kill(process.pid, "SIGTERM");

  const context: BaseContext<T> = Object.freeze({
    ...localContext,
    app,
    bootstrap,
    terminate,
    teardown
  });

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
        fn(context),
  };
};

export { makeContext };
