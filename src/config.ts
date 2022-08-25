import { REPLConfig } from '@/_boot/repl';
import { environment, EnvironmentConfig, envNumber, envString } from '@/_lib/Environment';
import { ServerConfig } from '@/_boot/server';
import { DatabaseConfig } from '@/_boot/database';
import { SwaggerConfig } from '@/_boot/swagger';
import { AppModulesConfig } from '@/_boot/appModules';
import { join } from 'path';

type Configuration = ServerConfig & DatabaseConfig & EnvironmentConfig & REPLConfig & SwaggerConfig & AppModulesConfig;

const config: Configuration = {
  appName: 'node-api-boilerplate',
  cli: process.argv.includes('--cli'),
  environment: environment(),
  repl: {
    port: envNumber('REPL_PORT', 2580),
  },
  http: {
    host: envString('HOST', 'localhost'),
    port: envNumber('PORT', 3000),
  },
  swagger: {
    title: 'Blog API',
    version: '1.0.0',
    basePath: '/api',
    docEndpoint: '/api-docs',
  },
  mongodb: {
    database: envString('DB_NAME', 'blog'),
    host: envString('DB_HOST', 'mongodb://localhost:27017'),
    username: envString('DB_USER', 'blog'),
    password: envString('DB_PASS', 'blog'),
  },
  keyPair: {
    publicKey: envString('PUBLIC_KEY', join(process.cwd(), 'secrets/public-key.pem')),
    privateKey: envString('PRIVATE_KEY', join(process.cwd(), 'secrets/private-key.pem')),
  },
  jwt: {
    ttl: envNumber('JWT_TTL', 60 * 60 * 24), // 1 day
    algorithm: envString('JWT_ALGORITHM', 'ES256'),
  },
};

export { config };
export type { Configuration };
