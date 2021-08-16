import EventEmitter from "events";
import { Lifecycle } from "@/_lib/Lifecycle";

type EntrypointFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void>;

type BootFn<T extends Record<string | symbol, any>> = (arg: BaseContext<T>) => Promise<void | CleanupFn>;

type BaseContext<T extends Record<string | symbol, any>> = {
  app: EventEmitter;
  bootstrap: <M extends Module<BootFn<T>>[]>(...modules: M) => Promise<void>;
  terminate: () => void;
} & T;

type Context<T extends Record<string | symbol, any>> = {
  bootFunction: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F) => M;
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

const moduleChain = <M extends Module<any>[]>(
  modules: M,
  handler?: (module: M[number]) => M extends Module<any> ? BootFn<any> : CleanupFn
) => {
  return modules.reduce((chain, module) => chain.then(handler ? handler(module) : module.fn()), Promise.resolve());
};

const makeContext = <T extends Record<string | symbol, any>>(
  localContext: T,
  opts: Partial<ContextOptions> = {}
): Context<T> => {
  const { shutdownTimeout, logger } = { ...defaultOptions, ...opts };

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

  const shutdown = async () => {
    app.emit(Lifecycle.SHUTTING_DOWN);

    logger.info("Terminating application");

    const { timeout } = await Promise.race([
      moduleChain(cleanUpFns, ({ name, fn }) => () => {
        logger.info(`Disposing of ${name} module.`);

        return fn().catch(err => {
          logger.error(`Error while disposing of ${name} module. Trying to resume shutdown`);
          logger.error(err);
        });
      }).then(() => ({ timeout: false })),
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

    app.emit(Lifecycle.BOOTING);

    await moduleChain(modules, ({ name, fn }) => () => {
      logger.info(`Bootstraping ${name} module.`);

      return fn(context).then(result => {
        if (typeof result === "function") {
          cleanUpFns = [{ name, fn: result }, ...cleanUpFns];
        }
      });
    });

    app.emit(Lifecycle.BOOTED);
  };

  const terminate = () => process.kill(process.pid, "SIGTERM");

  const context: BaseContext<T> = Object.freeze({
    ...localContext,
    app,
    bootstrap,
    terminate,
  });

  return {
    bootFunction: <F extends BootFn<T>, M extends Module<F>>(name: string, fn: F): M => ({
      name,
      fn,
    }) as M,
    withContext:
      <F extends EntrypointFn<T>>(fn: F): (() => Promise<void>) =>
      () =>
        fn(context),
  };
};

export { makeContext };
