import Fastify, { FastifyInstance } from 'fastify';
import { asValue } from 'awilix';
import httpLogger from 'pino-http';
import middie from 'middie';
import { requestId } from '@/_lib/http/middlewares/requestId';
import { requestContainer } from '@/_lib/http/middlewares/requestContainer';
import { errorHandler } from '@/_lib/http/middlewares/errorHandler';
import { makeModule } from '@/context';
import { gracefulShutdown } from '@/_lib/http/middlewares/gracefulShutdown';
import { errorConverters } from '@/_sharedKernel/interface/http/ErrorConverters';
import { ApiRouter } from '@/_lib/http/apiRouter';
import { HttpStatus } from '@/_lib/http/HttpStatus';

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
    const fastifyServer = Fastify();

    await fastifyServer.register(middie);

    const { shutdownHook, shutdownHandler } = gracefulShutdown(fastifyServer.server);

    fastifyServer.use(shutdownHandler());

    fastifyServer.use(requestId());
    fastifyServer.use(requestContainer(container));
    fastifyServer.use(httpLogger());

    const apiRouter: ApiRouter = (fn) => {
      fastifyServer.register(
        (fastify, _, done) => {
          fn(fastify);
          done();
        },
        { prefix: '/api' }
      );
    };

    onBooted(async () => {
      fastifyServer.use((req, res) => {
        res.writeHead(HttpStatus.NOT_FOUND).end();
      });

      fastifyServer.setErrorHandler(errorHandler(errorConverters, { logger }));
    });

    if (!cli && environment !== 'test') {
      onReady(
        async () =>
          new Promise<void>((resolve, reject) => {
            fastifyServer.listen(http.port, http.host, (error, address) => {
              if (error) {
                return reject(error);
              }

              logger.info(`Webserver listening at: ${address}`);
              resolve();
            });
          })
      );
    }

    register({
      server: asValue(fastifyServer),
      apiRouter: asValue(apiRouter),
    });

    return async () => {
      await shutdownHook();
    };
  }
);

type ServerRegistry = {
  requestId?: string;
  server: FastifyInstance;
  apiRouter: ApiRouter;
};

export { server };
export type { ServerRegistry, ServerConfig };
