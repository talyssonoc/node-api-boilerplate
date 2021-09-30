import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace ForbiddenError {
  const type = Symbol();
  const code = 'ForbiddenError';
  const message = 'Forbidden';

  export const create = (customMsg?: string): Exception => new BaseError({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { ForbiddenError };
