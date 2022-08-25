import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace BusinessError {
  const type = Symbol();
  const name = 'BusinessError';

  export const create = (message: string, code: string = name): Exception =>
    new BaseError({ type, name, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BusinessError };
