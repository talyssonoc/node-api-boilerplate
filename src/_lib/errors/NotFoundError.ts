import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace NotFoundError {
  const type = Symbol();
  const code = 'NotFoundError';

  export const create = (message: string): Exception => new BaseError({ type, code, message });

  export const is = makePredicate<Exception>(type);
}

export { NotFoundError };
