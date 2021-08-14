import { REPLConfig } from "@/_boot/repl";
import { environment, EnvironmentConfig, envNumber, envString } from "@/_lib/Environment";
import { ServerConfig } from "@/_boot/server";
import { DatabaseConfig } from "@/_boot/database";

type Configuration = ServerConfig & DatabaseConfig & EnvironmentConfig & REPLConfig;

const config: Configuration = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appName: require(`${process.cwd()}/package.json`).name,
  cli: process.argv.includes("--cli"),
  environment: environment(),
  repl: {
    port: envNumber("REPL_PORT", 2580),
  },
  http: {
    host: envString("HOST", "localhost"),
    port: envNumber("PORT", 3000),
  },
  mongodb: {
    database: envString("DB_NAME", "blog"),
    host: envString("DB_HOST", "mongodb://localhost:27017"),
    username: envString("DB_USER", "blog"),
    password: envString("DB_PASS", "blog"),
  },
};

export { config, Configuration };
