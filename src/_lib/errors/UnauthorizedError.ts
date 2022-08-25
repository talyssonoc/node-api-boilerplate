import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace UnauthorizedError {
  const type = Symbol();
  const name = 'UnauthorizedError';
  const defaultMessage = 'Unauthorized';

  export const create = (message: string = defaultMessage, code: string = name): Exception =>
    new BaseError({ type, name, code, message });

  export const is = makePredicate<Exception>(type);
}

export { UnauthorizedError };
