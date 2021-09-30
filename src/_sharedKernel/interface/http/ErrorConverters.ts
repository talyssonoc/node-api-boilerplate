import { ValidationError } from '@/_lib/errors/ValidationError';
import { errorConverter } from '@/_lib/http/middlewares/errorHandler';
import { BaseError } from '@/_lib/errors/BaseError';
import { NotFoundError } from '@/_lib/errors/NotFoundError';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { UnauthorizedError } from '@/_lib/errors/UnauthorizedError';
import { ForbiddenError } from '@/_lib/errors/ForbiddenError';
import { BusinessError } from '@/_sharedKernel/domain/error/BusinessError';
import { BadRequestError } from '@/_lib/errors/BadRequestError';

const errorConverters = [
  errorConverter(ValidationError.is, (err) => {
    const status = err.meta?.target === 'body' ? HttpStatus.UNPROCESSABLE_ENTITY : HttpStatus.BAD_REQUEST;

    return {
      status,
      body: {
        error: err.code,
        status,
        message: err.message,
        details: err.meta?.error.details.map((detail) => ({
          field: detail.path.join('.'),
          path: detail.path,
        })),
      },
    };
  }),
  errorConverter(BadRequestError.is, (err) => ({
    status: HttpStatus.BAD_REQUEST,
    body: {
      error: err.code,
      status: HttpStatus.BAD_REQUEST,
      message: err.message,
    },
  })),
  errorConverter(NotFoundError.is, (err) => ({
    status: HttpStatus.NOT_FOUND,
    body: {
      error: err.code,
      status: HttpStatus.NOT_FOUND,
      message: err.message,
    },
  })),
  errorConverter(UnauthorizedError.is, (err) => ({
    status: HttpStatus.UNAUTHORIZED,
    body: {
      error: err.code,
      status: HttpStatus.UNAUTHORIZED,
      message: err.message,
    },
  })),
  errorConverter(ForbiddenError.is, (err) => ({
    status: HttpStatus.FORBIDDEN,
    body: {
      error: err.code,
      status: HttpStatus.FORBIDDEN,
      message: err.message,
    },
  })),
  errorConverter(BusinessError.is, (err) => ({
    status: HttpStatus.CONFLICT,
    body: {
      error: err.code,
      status: HttpStatus.CONFLICT,
      kind: err.meta?.key,
      message: err.message,
    },
  })),
  errorConverter(
    (err: any | BaseError): err is BaseError => err instanceof BaseError,
    (err) => ({
      status: HttpStatus.BAD_REQUEST,
      body: err.message,
    })
  ),
];

export { errorConverters };
