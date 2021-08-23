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

    return promiseChain([
      ...transition(Lifecycle.BOOTING),
      ...transition(Lifecycle.BOOTED),
      ...transition(Lifecycle.STARTED),
      running,
    ]).catch((err) => {
      logger.error(err);

      stop();
    });
  };

  const stop = () => {
    if (appState === Lifecycle.IDLE) throw new Error("The application is not running.");

    if (release) {
      release();
    }

    return promiseChain([...transition(Lifecycle.SHUTTING_DOWN), ...transition(Lifecycle.TERMINATED)]);
  };

  const shutdown = (code: number) => async () => {
    setTimeout(() => {
      logger.error("Ok, my patience is over! #ragequit");
      process.exit(code);
    }, shutdownTimeout).unref();

    try {
      process.stdout.write("\n");
      logger.info("Terminating application");

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
