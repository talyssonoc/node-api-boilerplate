import { server, ServerConfig, ServerRegistry } from '@/_boot/server';
import { appModules, AppModulesConfig, AppModulesRegistry } from '@/_boot/appModules';
import { asValue } from 'awilix';
import { database, DatabaseConfig, DatabaseRegistry } from '@/_boot/database';
import { repl, REPLConfig } from '@/_boot/repl';
import { withContext } from '@/context';
import { Configuration } from '@/config';
import { Logger } from 'pino';
import { pubSub, PubSubRegistry } from '@/_boot/pubSub';
import { swagger, SwaggerConfig } from '@/_boot/swagger';
import { EnvironmentConfig } from '@/_lib/Environment';
import { ContextApp } from '@/_lib/Context';
import { Container, Initialize } from '@/container';

type MainConfig = ServerConfig & DatabaseConfig & EnvironmentConfig & REPLConfig & SwaggerConfig & AppModulesConfig;

const main = withContext(async ({ app, container, config, bootstrap, logger, initialize }) => {
  container.register({
    app: asValue(app),
    initialize: asValue(initialize),
    container: asValue(container),
    logger: asValue(logger),
    startedAt: asValue(new Date()),
    config: asValue(config),
  });

  await bootstrap(database, server, swagger, pubSub, repl, ...appModules);
});

type MainRegistry = {
  app: ContextApp;
  container: Container;
  initialize: Initialize;
  startedAt: Date;
  logger: Logger;
  config: Configuration;
} & DatabaseRegistry &
  ServerRegistry &
  PubSubRegistry &
  AppModulesRegistry;

export { main };
export type { MainConfig, MainRegistry };
