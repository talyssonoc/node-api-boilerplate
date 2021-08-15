import express, { Router, Application, json, urlencoded } from "express";
import { asValue } from "awilix";
import httpLogger from "pino-http";
import { logger } from "@/_lib/logger";
import { requestId } from "@/_lib/http/middlewares/requestId";
import { requestContainer } from "@/_lib/http/middlewares/requestContainer";
import { errorHandler } from "@/_lib/http/middlewares/errorHandler";
import { initFunction } from "@/context";
import { Lifecycle } from '@/_lib/Lifecycle';

type ServerConfig = {
  http: {
    host: string;
    port: number;
  };
};

const server = initFunction(async ({ app, container, config: { cli, http } }) => {
  const { register } = container;
  const server = express();

  server.use(requestId());
  server.use(requestContainer(container));
  server.use(httpLogger());
  server.use(json());
  server.use(urlencoded({ extended: false }));

  const rootRouter = Router();
  const apiRouter = Router();

  rootRouter.use("/api", apiRouter);

  server.use(rootRouter);

  app.once(Lifecycle.BOOTED, () => {
    server.use((req, res) => {
      res.sendStatus(404);
    });

    server.use(errorHandler());

    if (!cli) {
      server.listen(http.port, http.host, () => {
        logger.info(`Webserver listening at: http://${http.host}:${http.port}`);
      });
    }
  });

  register({
    server: asValue(server),
    rootRouter: asValue(rootRouter),
    apiRouter: asValue(apiRouter),
  });
});

type ServerRegistry = {
  requestId?: string;
  server: Application;
  rootRouter: Router;
  apiRouter: Router;
};

export { server, ServerRegistry, ServerConfig };
