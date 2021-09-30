import * as Joi from 'types-joi';
import { Request } from 'express';
import { InterfaceFrom } from 'types-joi';
import { ValidationError } from '@/_lib/errors/ValidationError';

type ValidationSchemas = {
  body?: Joi.BaseSchema<any>;
  params?: Joi.BaseSchema<any>;
  query?: Joi.BaseSchema<any>;
  headers?: Joi.BaseSchema<any>;
  cookies?: Joi.BaseSchema<any>;
};

type ValidationType<T> = T extends Joi.BaseSchema<any> ? InterfaceFrom<NonNullable<T>> : any;

type ValidationHelpers<T extends ValidationSchemas> = {
  getBody(req: Request): ValidationType<T['body']>;
  getParams(req: Request): ValidationType<T['params']>;
  getQuery(req: Request): ValidationType<T['query']>;
  getCookies(req: Request): ValidationType<T['cookies']>;
  getHeaders(req: Request): ValidationType<T['headers']>;
};

const makeValidator = <T extends ValidationSchemas>(schemas: T): ValidationHelpers<typeof schemas> => {
  const createValidator = (key: keyof ValidationSchemas) => (req: Request) => {
    if (!schemas[key]) {
      return req[key];
    }

    const { value, error } = (schemas[key] as Joi.BaseSchema<any>).validate(req[key]);

    if (error) {
      throw ValidationError.create({ target: key, error });
    }

    return value;
  };

  return {
    getBody: createValidator('body'),
    getParams: createValidator('params'),
    getQuery: createValidator('query'),
    getHeaders: createValidator('headers'),
    getCookies: createValidator('cookies'),
  };
};

export { makeValidator };
