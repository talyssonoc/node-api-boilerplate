import { ErrorRequestHandler } from 'express';
import { Exception } from '@/_lib/errors/BaseError';

type ErrorConverter<E extends Exception> = {
  test: (err: E | any) => err is E;
  converter: (err: E) => { status: number; body: string | Record<string, any> };
};

type ErrorConverterFn = <E extends Exception>(
  test: (err: E | any) => err is E,
  converter: (err: E) => { status: number; body: string | Record<string, any> }
) => ErrorConverter<E>;

const errorConverter: ErrorConverterFn = (test, converter) => ({ test, converter });

const makeErrorResponseBuilder = (errorConverters: ErrorConverter<any>[]) => (err: any) => {
  const mapping = errorConverters.find((parser) => parser.test(err));

  return mapping ? mapping.converter(err) : null;
};

type ErrorHandlerOptions = {
  logger: Pick<Console, 'error'>;
};

const defaultOptions: ErrorHandlerOptions = {
  logger: console,
};

const errorHandler = (
  errorMap: ErrorConverter<any>[],
  options: Partial<ErrorHandlerOptions> = {}
): ErrorRequestHandler => {
  const { logger } = { ...defaultOptions, ...options };
  const errorResponseBuilder = makeErrorResponseBuilder(errorMap);

  return (err, req, res, next) => {
    logger.error(err.stack);

    const errorResponse = errorResponseBuilder(err);

    if (errorResponse) {
      const { status, body } = errorResponse;

      return res.status(status).json(typeof body === 'object' ? body : { error: body });
    }

    res.status(500).json({ error: err.message });
  };
};

export { errorHandler, errorConverter };
