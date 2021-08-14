import REPL, { REPLEval, ReplOptions, REPLServer } from "repl";
import vm from "vm";
import { initFunction, Lifecycle } from "@/_lib/AppInitializer";
import EventEmitter from "events";
import { createServer } from "net";
import { logger } from "@/_lib/logger";

type Dependencies = {
  app: EventEmitter;
};

type REPLConfig = {
  appName: string;
  cli: boolean;
  repl: {
    port: number;
  };
};

const repl = initFunction(async (container, { appName, cli, environment, repl: { port } }) => {
  const { build } = container;

  const promisableEval: REPLEval = (cmd, context, filename, callback) => {
    const result = vm.runInContext(cmd, context);

    if (isPromise(result)) {
      return result.then(v => callback(null, v)).catch(e => callback(e, null));
    }

    return callback(null, result);
  };

  const isPromise = value => {
    return value && typeof value.then === "function" && typeof value.catch === "function";
  };

  const createREPL = (config: Partial<ReplOptions> = { input: process.stdin, output: process.stdout }): REPLServer => {
    const repl = REPL.start({
      eval: promisableEval,
      prompt: `${appName}$ `,
      ignoreUndefined: true,
      ...config,
    });

    Object.assign(repl.context, { registry: container.cradle, container });

    return repl;
  };

  const startREPL = () => {
    if (cli) {
      const repl = createREPL();

      repl.on("close", () => {
        process.exit(0);
      });
    } else if (environment !== "production") {
      createServer(socket => {
        const repl = createREPL({
          input: socket,
          output: socket,
          terminal: true,
        });

        repl.on("close", () => {
          socket.end();
        });

        socket.on("error", err => {
          logger.error("[REPL] Connection error");
          logger.error(err.stack);
          socket.end();
        });
      }).listen(port);
    }
  };

  build(({ app }: Dependencies) => {
    app.once(Lifecycle.BOOTED, startREPL);
  });
});

export { repl, REPLConfig };
