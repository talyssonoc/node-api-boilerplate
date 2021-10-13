import REPL, { REPLEval, ReplOptions, REPLServer } from 'repl';
import vm from 'vm';
import { createServer, Server } from 'net';
import { AwilixContainer } from 'awilix';
import { Logger } from 'pino';
import { EnvironmentConfig } from '../Environment';

type REPLConfigType<T> = {
  [key in keyof T]: T[key];
};

type ReplParameters = {
  container: AwilixContainer;
  config: REPLConfigType<{
    appName: string;
    cli: boolean;
    repl: { port: number };
    environment: EnvironmentConfig['environment'];
  }>;
  logger: Logger;
};

type REPL = {
  create: (config: Partial<ReplOptions>) => REPLServer;
  start: ({ terminate }) => Promise<void>;
  close: () => Promise<void>;
};

const isPromise = (value) => value && typeof value.then === 'function' && typeof value.catch === 'function';

const promisableEval: REPLEval = (cmd, context, filename, callback) => {
  const result = vm.runInContext(cmd, context);

  if (isPromise(result)) {
    return result.then((v) => callback(null, v)).catch((e) => callback(e, null));
  }

  return callback(null, result);
};

const makeREPL = ({
  container,
  config: {
    appName,
    cli,
    environment,
    repl: { port },
  },
  logger,
}: ReplParameters): REPL => {
  let server: Server;

  const create = (config: Partial<ReplOptions> = { input: process.stdin, output: process.stdout }): REPLServer => {
    const repl = REPL.start({
      eval: promisableEval,
      prompt: `${appName}$ `,
      ignoreUndefined: true,
      ...config,
    });

    Object.assign(repl.context, { registry: container.cradle, container });

    return repl;
  };

  return {
    create,
    start: async ({ terminate }) => {
      if (cli) {
        const repl = create();

        repl.on('close', terminate);
      } else if (!['production', 'test'].includes(environment)) {
        server = createServer((socket) => {
          const repl = create({
            input: socket,
            output: socket,
            terminal: true,
          });

          repl.on('close', () => {
            socket.end();
          });

          socket.on('error', (err) => {
            logger.error('[REPL] Connection error');
            logger.error(err);
            socket.end();
          });
        }).listen(port);
      }
    },
    close: async () => {
      if (server && server.listening) {
        await new Promise<void>((resolve, reject) =>
          server.close((err) => {
            if (err) return reject(err);
            resolve();
          })
        );
      }
    },
  };
};

export { makeREPL };
export type { REPLConfigType };
