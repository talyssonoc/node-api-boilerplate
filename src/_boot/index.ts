import { server } from "@/_boot/server";
import { modules } from "@/_boot/modules";
import { asValue } from "awilix";
import { database } from "@/_boot/database";
import { repl } from "@/_boot/repl";
import { withContext } from "@/context";
import { Configuration } from "@/config";
import { Logger } from "pino";
import { pubSub } from "@/_boot/pubSub";

const main = withContext(async ({ app, container, config, bootstrap, logger }) => {
  container.register({
    app: asValue(app),
    logger: asValue(logger),
    startedAt: asValue(new Date()),
    config: asValue(config),
  });

  await bootstrap(database, server, pubSub, repl, ...modules);
});

type MainRegistry = {
  app: any;
  startedAt: Date;
  logger: Logger;
  config: Configuration;
};

export { main };
export type { MainRegistry };
