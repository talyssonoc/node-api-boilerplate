import { Lifecycle } from "@/_lib/Lifecycle";

type HookFn = () => Promise<void>;

type HookStore = {
  get: (lifecycle: Lifecycle) => HookFn[];
  append: (lifecycle: Lifecycle, ...fn: HookFn[]) => void;
  prepend: (lifecycle: Lifecycle, ...fn: HookFn[]) => void;
};

type Application = {
  getState: () => Lifecycle;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  terminate: () => void;
  once: (lifecycle: Lifecycle, fn: HookFn | HookFn[], order?: "append" | "prepend") => void;
};

type ApplicationOptions = {
  shutdownTimeout: number;
  logger: Pick<Console, "info" | "error">;
};

const makeApp = ({ logger, shutdownTimeout }: ApplicationOptions): Application => {
  let appState: Lifecycle = Lifecycle.IDLE;
  let release: () => void;

  const hooks = makeHookStore();

  const running: HookFn = () =>
    new Promise<void>((resolve) => {
      logger.info("Application running");

      release = resolve;
    });

  const transition = (lifecycle: Lifecycle) => [
    async () => {
      appState = lifecycle;
    },
    () => promiseChain(hooks.get(lifecycle)),
  ];

  const start = () => {
    if (appState !== Lifecycle.IDLE) throw new Error("The application has already started.");

    logger.info("Starting application");

    return promiseChain([
      ...transition(Lifecycle.BOOTING),
      ...transition(Lifecycle.BOOTED),
      ...transition(Lifecycle.STARTED),
      ...transition(Lifecycle.RUNNING),
      running,
    ]).catch((err) => {
      logger.error(err);

      stop();
    });
  };

  const stop = async () => {
    if (appState === Lifecycle.IDLE) throw new Error("The application is not running.");

    if (release) {
      release();
    }

    logger.info("Stopping application");

    await promiseChain([...transition(Lifecycle.SHUTTING_DOWN), ...transition(Lifecycle.TERMINATED)]);

    setTimeout(() => {
      logger.info(
        "The stop process has finished but something is keeping the application active. Check your cleanup process!"
      );
    }, 5000).unref();
  };

  const shutdown = (code: number) => async () => {
    process.stdout.write("\n");

    setTimeout(() => {
      logger.error("Ok, my patience is over! #ragequit");
      process.exit(code);
    }, shutdownTimeout).unref();

    try {
      await stop();
    } catch (err) {
      logger.error(err);
    }

    process.exit(code);
  };

  const terminate = () => process.kill(process.pid, "SIGTERM");

  process.on("SIGTERM", shutdown(0));
  process.on("SIGINT", shutdown(0));
  process.on("uncaughtException", shutdown(1));
  process.on("unhandledRejection", shutdown(1));

  return {
    start,
    stop,
    terminate,
    getState: () => appState,
    once: (lifecycle, fn, order = "append") =>
      Array.isArray(fn) ? hooks[order](lifecycle, ...fn) : hooks[order](lifecycle, fn),
  };
};

const promiseChain = <M extends HookFn[]>(hooksFns: M) => {
  return hooksFns.reduce((chain, fn) => chain.then(fn), Promise.resolve());
};

const makeHookStore = (): HookStore => {
  const hooks = new Map<Lifecycle, HookFn[]>();

  const get = (lifecycle: Lifecycle) => hooks.get(lifecycle) || [];

  const append = (lifecycle: Lifecycle, ...fn: HookFn[]) => hooks.set(lifecycle, [...get(lifecycle), ...fn]);

  const prepend = (lifecycle: Lifecycle, ...fn: HookFn[]) => hooks.set(lifecycle, [...fn, ...get(lifecycle)]);

  return {
    get,
    append,
    prepend,
  };
};

export { makeApp };
export type { Application, HookFn };
