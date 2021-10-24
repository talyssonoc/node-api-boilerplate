import { Exception } from '@/_lib/errors/BaseError';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { ErrorHandler } from '@/_lib/http/RequestHandler';

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

const errorHandler = (errorMap: ErrorConverter<any>[], options: Partial<ErrorHandlerOptions> = {}): ErrorHandler => {
  const { logger } = { ...defaultOptions, ...options };
  const errorResponseBuilder = makeErrorResponseBuilder(errorMap);

  return (err, request, reply) => {
    logger.error(err.stack);

    const errorResponse = errorResponseBuilder(err);

    if (errorResponse) {
      const { status, body } = errorResponse;

      reply.status(status).send(typeof body === 'object' ? body : { error: body });
      return;
    }

    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
  };
};

export { errorHandler, errorConverter };
