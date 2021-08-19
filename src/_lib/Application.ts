import { Lifecycle } from "@/_lib/Lifecycle";
import { EventEmitter } from 'stream';

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

  const hooks = makeHookStore();

  const transition = (lifecycle: Lifecycle) => [
    async () => {
      appState = lifecycle;
    },
    () => promiseChain(hooks.get(lifecycle)),
  ];

  const start = async () => {
    if (appState !== Lifecycle.IDLE) throw new Error("The application has already started.");

    console.log(hooks.get(Lifecycle.BOOTED));

    return promiseChain([
      ...transition(Lifecycle.BOOTING),
      ...transition(Lifecycle.BOOTED),
      ...transition(Lifecycle.STARTED),
    ]);
  };

  const stop = async () => {
    if (appState !== Lifecycle.STARTED) throw new Error("The application is not running.");

    return promiseChain([...transition(Lifecycle.SHUTTING_DOWN), ...transition(Lifecycle.TERMINATED)]);
  };

  const shutdown = async () => {
    try {
      logger.info("Terminating application");
      const { timeout } = await Promise.race([stop().then(() => ({ timeout: false })), wait(shutdownTimeout)]);

      if (timeout) {
        logger.error("Ok, my patience is over! #ragequit");
        process.exit(1);
      }

      process.exit(0);
    } catch (err) {
      logger.error(err);

      process.exit(1);
    }
  };

  const terminate = () => process.kill(process.pid, "SIGTERM");

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return {
    start,
    stop,
    terminate,
    getState: () => appState,
    once: (lifecycle, fn, order = "append") =>
      Array.isArray(fn) ? hooks[order](lifecycle, ...fn) : hooks[order](lifecycle, fn),
  };
};

const wait = (timeout: number) =>
  new Promise<{ timeout: boolean }>((resolve) => setTimeout(() => resolve({ timeout: true }), timeout));

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
