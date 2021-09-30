import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env'
      : existsSync(`.env.${process.env.NODE_ENV}.local`)
      ? `.env.${process.env.NODE_ENV}.local`
      : `.env.${process.env.NODE_ENV}`,
});

const environments = ['development', 'production', 'test'] as const;

type EnvironmentTypes = typeof environments[number];

type EnvironmentConfig = {
  environment: EnvironmentTypes;
};

const environment = (defaultValue: EnvironmentTypes = 'development'): EnvironmentTypes => {
  let env: any = process.env.NODE_ENV;

  if (!env) {
    env = process.env.NODE_ENV = defaultValue;
  }

  if (!environments.includes(env)) {
    throw new TypeError(`Invalid value for NODE_ENV variable. Accepted values are: ${environments.join(' | ')}.`);
  }

  return env;
};

const envString = (variable: string, defaultValue?: string): string => {
  const value = process.env[variable] || defaultValue;

  if (value == null) {
    throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
  }

  return value;
};

const envNumber = (variable: string, defaultValue?: number): number => {
  const value = Number(process.env[variable]) || defaultValue;

  if (value == null) {
    throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
  }

  return value;
};

export { environment, envString, envNumber };
export type { EnvironmentConfig };
