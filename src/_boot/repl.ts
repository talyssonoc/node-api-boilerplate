import REPL, { REPLEval, ReplOptions, REPLServer } from "repl";
import vm from "vm";
import { createServer } from "net";
import { bootFunction } from "@/context";
import { Lifecycle } from "@/_lib/Lifecycle";

type REPLConfig = {
  appName: string;
  cli: boolean;
  repl: {
    port: number;
  };
};

const repl = bootFunction("repl",
  async ({
    app,
    container,
    config: {
      appName,
      cli,
      environment,
      repl: { port },
    },
    terminate,
    logger,
  }) => {
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

    const startREPL = () => {
      if (cli) {
        const repl = createREPL();

        repl.on("close", terminate);
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
            logger.error(err);
            socket.end();
          });
        }).listen(port);
      }
    };

    app.once(Lifecycle.BOOTED, startREPL);
  }
);

export { repl, REPLConfig };
