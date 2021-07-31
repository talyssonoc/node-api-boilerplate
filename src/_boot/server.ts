import express, { Router } from "express";
import { asValue } from "awilix";
import { Application, json, urlencoded } from "express";
import httpLogger from "pino-http";
import { Request, Response } from "express-serve-static-core";
import { InitFunction, Lifecycle } from "@/_lib/AppInitializer";
import EventEmitter from "events";
import { logger } from "@/_lib/logger";
import { requestId } from "@/_lib/middlewares/requestId";
import { requestContainer } from "@/_lib/middlewares/requestContainer";
import { ValidationError } from "@/_lib/validation/ValidationError";

type Dependencies = {
  app: EventEmitter;
};

type Configuration = {
  http: {
    host: string;
    port: number;
  };
};

const server: InitFunction = async (container, { http }) => {
  const { register, build } = container;
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

  build(({ app }: Dependencies) => {
    app.once(Lifecycle.BOOTED, () => {
      server.use((req: Request, res: Response) => {
        res.sendStatus(404);
      });

      server.use((err: Error, req: Request, res: Response) => {
        console.error(err);

        if (ValidationError.is(err)) {
          res.status(400).json({ target: err.target, message: err.message, error: err.error });
        } else {
          res.status(400).json({ error: err.message });
        }
      });

      server.listen(http.port, http.host, () => {
        logger.info(`Webserver listening at: http://${http.host}:${http.port}`);
      });
    });
  });

  register({
    server: asValue(server),
    rootRouter: asValue(rootRouter),
    apiRouter: asValue(apiRouter),
  });
};

type Container = {
  server: Application;
  rootRouter: Router;
  apiRouter: Router;
};

export { server, Container, Configuration };
