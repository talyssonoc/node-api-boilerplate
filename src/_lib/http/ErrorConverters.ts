import { ValidationException } from "@/_lib/exceptions/ValidationException";
import { errorConverter } from "@/_lib/http/middlewares/errorHandler";
import { BaseException } from "@/_lib/exceptions/BaseException";
import { NotFoundException } from "@/_lib/exceptions/NotFoundException";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { UnauthorizedException } from "@/_lib/exceptions/UnauthorizedException";
import { ForbiddenException } from "@/_lib/exceptions/ForbiddenException";
import { BusinessException } from "@/_lib/exceptions/BusinessException";
import { BadRequestException } from "@/_lib/exceptions/BadRequestException";

const errorConverters = [
  errorConverter(ValidationException.is, (err) => {
    const status = err.meta?.target === "body" ? HttpStatus.UNPROCESSABLE_ENTITY : HttpStatus.BAD_REQUEST;

    return {
      status,
      body: {
        error: err.code,
        status,
        message: err.message,
        details: err.meta?.error.details.map((detail) => ({
          field: detail.path.join("."),
          path: detail.path,
        })),
      },
    };
  }),
  errorConverter(BadRequestException.is, (err) => ({
    status: HttpStatus.BAD_REQUEST,
    body: {
      error: err.code,
      status: HttpStatus.BAD_REQUEST,
      message: err.message,
    },
  })),
  errorConverter(NotFoundException.is, (err) => ({
    status: HttpStatus.NOT_FOUND,
    body: {
      error: err.code,
      status: HttpStatus.NOT_FOUND,
      message: err.message,
    },
  })),
  errorConverter(UnauthorizedException.is, (err) => ({
    status: HttpStatus.UNAUTHORIZED,
    body: {
      error: err.code,
      status: HttpStatus.UNAUTHORIZED,
      message: err.message,
    },
  })),
  errorConverter(ForbiddenException.is, (err) => ({
    status: HttpStatus.FORBIDDEN,
    body: {
      error: err.code,
      status: HttpStatus.FORBIDDEN,
      message: err.message,
    },
  })),
  errorConverter(BusinessException.is, (err) => ({
    status: HttpStatus.CONFLICT,
    body: {
      error: err.code,
      status: HttpStatus.CONFLICT,
      message: err.message,
    },
  })),
  errorConverter(
    (err: any | BaseException): err is BaseException => err instanceof BaseException,
    (err) => ({
      status: HttpStatus.BAD_REQUEST,
      body: err.message,
    })
  ),
];

export { errorConverters };
