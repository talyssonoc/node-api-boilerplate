import { makePredicate } from "@/_lib/Predicate";
import { BaseError, Exception } from "@/_lib/exceptions/BaseError";

namespace NotFoundError {
  const type = Symbol();
  const code = "NotFoundError";
  const message = "No %s was found for id %s.";

  export const create = (customMsg?: string) => new BaseError({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { NotFoundError };
