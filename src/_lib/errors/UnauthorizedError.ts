import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace UnauthorizedError {
  const type = Symbol();
  const name = 'UnauthorizedError';
  const _message = 'Unauthorized';

  export const create = (message: string = _message, code: string = name): Exception =>
    new BaseError({ type, name, code, message });

  export const is = makePredicate<Exception>(type);
}

export { UnauthorizedError };
