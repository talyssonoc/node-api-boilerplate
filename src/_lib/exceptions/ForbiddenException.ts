import { BaseException, Exception } from "@/_lib/exceptions/BaseException";
import { makePredicate } from "@/_lib/Predicate";

namespace ForbiddenException {
  const type = Symbol();
  const code = "ForbiddenException";
  const message = "Forbidden";

  export const create = (customMsg?: string) => new BaseException({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { ForbiddenException };
