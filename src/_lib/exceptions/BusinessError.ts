import { BaseError, Exception } from "@/_lib/exceptions/BaseError";
import { makePredicate } from "@/_lib/Predicate";

namespace BusinessError {
  const type = Symbol();
  const code = "BusinessError";

  export const create = (message: string) => new BaseError({ type, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BusinessError };
