import express, { Router, Application, json, urlencoded } from 'express';
import { asValue } from 'awilix';
import httpLogger from 'pino-http';
import { createServer } from 'http';
import { requestId } from '@/_lib/http/middlewares/requestId';
import { requestContainer } from '@/_lib/http/middlewares/requestContainer';
import { errorHandler } from '@/_lib/http/middlewares/errorHandler';
import { makeModule } from '@/context';
import { gracefulShutdown } from '@/_lib/http/middlewares/gracefulShutdown';
import { errorConverters } from '@/_sharedKernel/interface/http/ErrorConverters';

type ServerConfig = {
  http: {
    host: string;
    port: number;
  };
};

const server = makeModule(
  'server',
  async ({ app: { onBooted, onReady }, container, config: { cli, http, environment }, logger }) => {
    const { register } = container;
    const server = express();

    const httpServer = createServer(server);

    const { shutdownHook, shutdownHandler } = gracefulShutdown(httpServer);

    server.use(shutdownHandler());
    server.use(requestId());
    server.use(requestContainer(container));
    server.use(httpLogger());
    server.use(json());
    server.use(urlencoded({ extended: false }));

    const rootRouter = Router();
    const apiRouter = Router();

    rootRouter.use('/api', apiRouter);

    server.use(rootRouter);

    onBooted(async () => {
      server.use((req, res) => {
        res.sendStatus(404);
      });

      server.use(errorHandler(errorConverters, { logger }));
    });

    if (!cli && environment !== 'test') {
      onReady(
        async () =>
          new Promise<void>((resolve) => {
            httpServer.listen(http.port, http.host, () => {
              logger.info(`Webserver listening at: http://${http.host}:${http.port}`);
              resolve();
            });
          })
      );
    }

    register({
      server: asValue(server),
      rootRouter: asValue(rootRouter),
      apiRouter: asValue(apiRouter),
    });

    return async () => {
      await shutdownHook();
    };
  }
);

type ServerRegistry = {
  requestId?: string;
  server: Application;
  rootRouter: Router;
  apiRouter: Router;
};

export { server };
export type { ServerRegistry, ServerConfig };
