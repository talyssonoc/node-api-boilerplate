type HookFn = () => Promise<void>;

type HookStore = {
  get: (lifecycle: Lifecycle) => HookFn[];
  append: (lifecycle: Lifecycle, ...fn: HookFn[]) => void;
  prepend: (lifecycle: Lifecycle, ...fn: HookFn[]) => void;
};

enum Lifecycle {
  BOOTING = 'BOOTING',
  BOOTED = 'BOOTED',
  READY = 'READY',
  RUNNING = 'RUNNING',
  DISPOSING = 'DISPOSING',
  DISPOSED = 'DISPOSED',
}

type LifecycleHooks = {
  [key in `on${Capitalize<Lowercase<keyof typeof Lifecycle>>}`]: (
    fn: HookFn | HookFn[],
    order?: 'append' | 'prepend'
  ) => void;
};

type Application = {
  getState: () => AppState;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  terminate: () => void;
  decorateHooks: (decorator?: (lifecycle: Lifecycle, fn: HookFn | HookFn[]) => HookFn | HookFn[]) => Application;
} & LifecycleHooks;

type ApplicationOptions = {
  shutdownTimeout: number;
  logger: Pick<Console, 'info' | 'error' | 'warn'>;
};

const makeApp = ({ logger, shutdownTimeout }: ApplicationOptions): Application => {
  let appState: AppState = AppState.IDLE;
  let release: null | (() => void);

  const hooks = makeHookStore();

  const started: HookFn = () =>
    new Promise<void>((resolve) => {
      logger.info('Application started');

      appState = AppState.STARTED;

      release = resolve;
    });

  const status = (newStatus: AppState) => async () => {
    appState = newStatus;
  };

  const transition = (lifecycle: Lifecycle) => () => promiseChain(hooks.get(lifecycle));

  const start = memo(async () => {
    if (appState !== AppState.IDLE) throw new Error('The application has already started.');

    logger.info('Starting application');

    try {
      await promiseChain([
        status(AppState.STARTING),
        transition(Lifecycle.BOOTING),
        transition(Lifecycle.BOOTED),
        transition(Lifecycle.READY),
        transition(Lifecycle.RUNNING),
        started,
      ]);
    } catch (err) {
      logger.error(err);

      await stop();
    }
  });

  const stop = memo(async () => {
    if (appState === AppState.IDLE) throw new Error('The application is not running.');

    if (release) {
      release();
      release = null;
    }

    logger.info('Stopping application');

    await promiseChain([
      status(AppState.STOPPING),
      transition(Lifecycle.DISPOSING),
      transition(Lifecycle.DISPOSED),
      status(AppState.STOPPED),
    ]);

    setTimeout(() => {
      logger.warn(
        'The stop process has finished but something is keeping the application from exiting. ' +
          'Check your cleanup process!'
      );
    }, 5000).unref();
  });

  let forceShutdown = false;

  const shutdown = (code: number) => async () => {
    process.stdout.write('\n');

    setTimeout(() => {
      logger.error('Ok, my patience is over! #ragequit');
      process.exit(code);
    }, shutdownTimeout).unref();

    if ((appState === AppState.STOPPING || appState === AppState.STOPPED) && code === 0) {
      if (forceShutdown) {
        process.kill(process.pid, 'SIGKILL');
      }

      logger.warn('The application is yet to finishing the shutdown process. Repeat the command to force exit');
      forceShutdown = true;
      return;
    }

    try {
      await stop();
    } catch (err) {
      logger.error(err);
    }

    process.exit(code);
  };

  const terminate = () => process.kill(process.pid, 'SIGTERM');

  process.on('SIGTERM', shutdown(0));
  process.on('SIGINT', shutdown(0));
  process.on('uncaughtException', shutdown(1));
  process.on('unhandledRejection', shutdown(1));

  const lifecycleHooks = (
    decorator: (lifecycle: Lifecycle, fn: HookFn | HookFn[]) => HookFn | HookFn[] = (lifecycle, fn) => fn
  ) => {
    const once = (lifecycle, fn, order = 'append') => {
      const decoratedFn = decorator(lifecycle, fn);
      Array.isArray(decoratedFn) ? hooks[order](lifecycle, ...decoratedFn) : hooks[order](lifecycle, decoratedFn);
    };
    return Object.keys(Lifecycle).reduce(
      (acc, hook) => ({
        ...acc,
        [`on${capitalize(hook)}`]: (fn: HookFn | HookFn[], order?: 'append' | 'prepend') =>
          once(Lifecycle[hook], fn, order),
      }),
      {}
    ) as unknown as LifecycleHooks;
  };

  const application: Application = {
    start,
    stop,
    terminate,
    getState: () => appState,
    decorateHooks: (decorator?): Application => ({
      ...application,
      ...lifecycleHooks(decorator),
    }),
    ...lifecycleHooks(),
  };

  return application;
};

enum AppState {
  IDLE = 'IDLE',
  STARTING = 'STARTING',
  STARTED = 'STARTED',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPED',
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const memo = <F extends (...args: any[]) => any>(fn: F) => {
  let value: ReturnType<F>;

  return (...args: Parameters<F>): ReturnType<F> => {
    if (!value) {
      value = fn(args);
    }

    return value;
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
