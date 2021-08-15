import { server } from "@/_boot/server";
import { modules } from "@/_boot/modules";
import EventEmitter from "events";
import { asValue } from "awilix";
import { database } from "@/_boot/database";
import { repl } from "@/_boot/repl";
import { context, initializer } from '@/context';
import { Lifecycle } from '@/_lib/Lifecycle';
import { Configuration } from '@/config';

const bootstrap = async () => {
  const { app, container, config } = context;
  
  container.register({
    app: asValue(app),
    startedAt: asValue(new Date()),
    config: asValue(config)
  });

  app.emit(Lifecycle.BOOTING);

  await initializer(database, server, repl, ...modules);

  app.emit(Lifecycle.BOOTED);
};

type BootstrapRegistry = {
  app: EventEmitter;
  startedAt: Date;
  config: Configuration;
};

export { bootstrap, BootstrapRegistry };
