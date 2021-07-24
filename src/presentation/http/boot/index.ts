import {init} from "@/lib/Init";
import { errorHandler } from "@/presentation/http/boot/errorHandler";
import { express } from "@/presentation/http/boot/express";
import { modules } from "@/presentation/http/boot/modules";
import { routes } from "@/presentation/http/boot/routes";
import { asValue, createContainer } from "awilix";

const bootstrap = async app => {
  const container = createContainer();

  app.set("container", container);

  container.register({
    app: asValue(app),
    startedAt: asValue(new Date()),
  });

  await init([express, routes, modules, errorHandler])(app, container, {});
};

export { bootstrap };
