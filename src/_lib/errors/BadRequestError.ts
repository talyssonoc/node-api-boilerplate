import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace BadRequestError {
  const type = Symbol();
  const code = 'BadRequestError';

  export const create = (message: string): Exception => new BaseError({ type, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BadRequestError };
