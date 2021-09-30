import REPL, { REPLEval, ReplOptions, REPLServer } from 'repl';
import vm from 'vm';
import { createServer, Server } from 'net';
import { makeModule } from '@/context';

type REPLConfig = {
  appName: string;
  cli: boolean;
  repl: {
    port: number;
  };
};

const repl = makeModule(
  'repl',
  async ({
    app: { onReady, terminate },
    container,
    config: {
      appName,
      cli,
      environment,
      repl: { port },
    },
    logger,
  }) => {
    const promisableEval: REPLEval = (cmd, context, filename, callback) => {
      const result = vm.runInContext(cmd, context);

      if (isPromise(result)) {
        return result.then((v) => callback(null, v)).catch((e) => callback(e, null));
      }

      return callback(null, result);
    };

    const isPromise = (value) => value && typeof value.then === 'function' && typeof value.catch === 'function';

    const createREPL = (
      config: Partial<ReplOptions> = { input: process.stdin, output: process.stdout }
    ): REPLServer => {
      const repl = REPL.start({
        eval: promisableEval,
        prompt: `${appName}$ `,
        ignoreUndefined: true,
        ...config,
      });

      Object.assign(repl.context, { registry: container.cradle, container });

      return repl;
    };

    let server: Server;

    const startREPL = async () => {
      if (cli) {
        const repl = createREPL();

        repl.on('close', terminate);
      } else if (!['production', 'test'].includes(environment)) {
        server = createServer((socket) => {
          const repl = createREPL({
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
    };

    onReady(startREPL);

    return async () => {
      if (server && server.listening) {
        await new Promise<void>((resolve, reject) =>
          server.close((err) => {
            if (err) return reject(err);
            resolve();
          })
        );
      }
    };
  }
);

export { repl };
export type { REPLConfig };
