import { container } from "@/container";
import { Lifecycle, makeAppInitializer } from "@/_lib/AppInitializer";
import { config } from "@/config";
import { server } from "@/_boot/server";
import { modules } from "@/_boot/modules";
import EventEmitter from "events";
import { asValue } from "awilix";
import { database } from "@/_boot/database";

const bootstrap = async () => {
  const app = new EventEmitter();

  container.register({
    app: asValue(app),
  });

  app.emit(Lifecycle.BOOTING);

  const initialize = makeAppInitializer(container, config);

  await initialize(database, server, ...modules);

  app.emit(Lifecycle.BOOTED);
};

type Container = {
  app: EventEmitter;
};

export { bootstrap, Container };
