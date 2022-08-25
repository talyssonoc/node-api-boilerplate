import REPL, { REPLEval, ReplOptions, REPLServer } from 'repl';
import vm from 'vm';
import { createServer, Server, Socket } from 'net';

type REPLProps = {
  context: Record<string, any>;
  prompt: string;
  cli: boolean;
  remote: false | { port: number };
  logger: Pick<Console, 'error'>;
};

type REPLInstance = {
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

const makeREPL = ({ context, prompt, cli, remote, logger }: REPLProps): REPLInstance => {
  let server: Server;

  const create = (config: Partial<ReplOptions> = { input: process.stdin, output: process.stdout }): REPLServer => {
    const repl = REPL.start({
      eval: promisableEval,
      prompt: `${prompt}$ `,
      ignoreUndefined: true,
      ...config,
    });

    Object.assign(repl.context, context);

    return repl;
  };

  let destroySocket: Socket['destroy'] = () => null;

  return {
    create,
    start: async ({ terminate }) => {
      if (cli) {
        const repl = create();

        repl.on('close', terminate);
      } else if (remote) {
        server = createServer((socket) => {
          const repl = create({
            input: socket,
            output: socket,
            terminal: true,
          });

          destroySocket = socket.destroy.bind(socket);

          repl.on('close', () => {
            socket.end();
          });

          socket.on('error', (err) => {
            logger.error('[REPL] Connection error');
            logger.error(err);
            socket.end();
          });
        }).listen(remote.port);
      }
    },
    close: async () => {
      if (server && server.listening) {
        await new Promise<void>((resolve, reject) => {
          destroySocket();

          server.close((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      }
    },
  };
};

export { makeREPL };
