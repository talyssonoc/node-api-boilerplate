import { BaseError, Exception } from "@/_lib/exceptions/BaseError";
import { makePredicate } from "@/_lib/Predicate";

namespace ForbiddenError {
  const type = Symbol();
  const code = "ForbiddenError";
  const message = "Forbidden";

  export const create = (customMsg?: string) => new BaseError({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { ForbiddenError };
