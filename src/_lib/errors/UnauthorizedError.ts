import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace UnauthorizedError {
  const type = Symbol();
  const code = 'UnauthorizedError';
  const message = 'Unauthorized';

  export const create = (customMsg?: string): Exception => new BaseError({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { UnauthorizedError };
