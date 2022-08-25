import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace NotFoundError {
  const type = Symbol();
  const name = 'NotFoundError';
  const _message = 'Not Found';

  export const create = (message: string = _message, code: string = name): Exception =>
    new BaseError({ type, name, code, message });

  export const is = makePredicate<Exception>(type);
}

export { NotFoundError };
