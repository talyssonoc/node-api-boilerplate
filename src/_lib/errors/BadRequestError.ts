import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace BadRequestError {
  const type = Symbol();
  const name = 'BadRequestError';
  const _message = 'Bad Request';

  export const create = (message: string = _message, code: string = name): Exception =>
    new BaseError({ type, name, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BadRequestError };
