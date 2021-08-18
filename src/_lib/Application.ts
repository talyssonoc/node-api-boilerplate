import { Lifecycle } from "@/_lib/Lifecycle";
import EventEmitter from "events";

type HookFn = () => Promise<void>;

type HookStore = {
  get: (lifecycle: Lifecycle) => HookFn[];
  append: (lifecycle: Lifecycle, fn: HookFn) => void;
  prepend: (lifecycle: Lifecycle, fn: HookFn) => void;
};

type Application = {
  getState: () => Lifecycle;
  start: () => void;
  stop: () => void;
  once: (lifecycle: Lifecycle, fn: HookFn, order?: "append" | "prepend") => void;
};

const makeHookStore = (): HookStore => {
  const hooks = new Map<Lifecycle, HookFn[]>();

  const get = (lifecycle: Lifecycle) => hooks.get(lifecycle) || [];

  const append = (lifecycle: Lifecycle, fn: HookFn) => hooks.set(lifecycle, [...get(lifecycle), fn]);

  const prepend = (lifecycle: Lifecycle, fn: HookFn) => hooks.set(lifecycle, [fn, ...get(lifecycle)]);

  return {
    get,
    append,
    prepend,
  };
};

const promiseChain = <M extends HookFn[]>(hooksFns: M) => {
  return hooksFns.reduce((chain, fn) => chain.then(fn), Promise.resolve());
};

const makeApp = (): Application => {
  const app = new EventEmitter();
  let appState: Lifecycle = Lifecycle.IDLE;

  const hooks = makeHookStore();

  const start = () => {
    if (appState !== Lifecycle.IDLE) throw new Error("The application has already started.");

    app.emit(Lifecycle.BOOTING);
  };

  const stop = () => {
    if (appState !== Lifecycle.STARTED) throw new Error("The application is not running.");

    app.emit(Lifecycle.SHUTTING_DOWN);
  };

  app.once(Lifecycle.BOOTING, async () => {
    appState = Lifecycle.BOOTING;

    await promiseChain(hooks.get(Lifecycle.BOOTING));

    app.emit(Lifecycle.BOOTED);
  });

  app.once(Lifecycle.BOOTED, async () => {
    appState = Lifecycle.BOOTED;

    await promiseChain(hooks.get(Lifecycle.BOOTED));

    app.emit(Lifecycle.STARTED);
  });

  app.once(Lifecycle.STARTED, async () => {
    appState = Lifecycle.STARTED;

    await promiseChain(hooks.get(Lifecycle.STARTED));
  });

  app.once(Lifecycle.SHUTTING_DOWN, async () => {
    appState = Lifecycle.SHUTTING_DOWN;

    await promiseChain(hooks.get(Lifecycle.SHUTTING_DOWN));

    app.emit(Lifecycle.TERMINATED);
  });

  app.once(Lifecycle.TERMINATED, async () => {
    appState = Lifecycle.TERMINATED;

    await promiseChain(hooks.get(Lifecycle.TERMINATED));

    app.removeAllListeners();
  });

  return {
    start,
    stop,
    getState: () => appState,
    once: (lifecycle, fn, order = "append") => hooks[order](lifecycle, fn),
  };
};

export { makeApp };
export type { Application };
