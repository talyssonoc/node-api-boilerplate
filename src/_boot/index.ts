import { server } from "@/_boot/server";
import { modules } from "@/_boot/modules";
import EventEmitter from "events";
import { asValue } from "awilix";
import { database } from "@/_boot/database";
import { repl } from "@/_boot/repl";
import { withContext } from "@/context";
import { Configuration } from "@/config";
import { Logger } from "pino";

const main = withContext(async ({ app, container, config, bootstrap, logger }) => {
  container.register({
    app: asValue(app),
    logger: asValue(logger),
    startedAt: asValue(new Date()),
    config: asValue(config),
  });

  await bootstrap(database, server, repl, ...modules);
});

type MainRegistry = {
  app: EventEmitter;
  startedAt: Date;
  logger: Logger;
  config: Configuration;
};

export { main };
export type { MainRegistry };
