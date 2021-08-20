import { BaseException, Exception } from "@/_lib/exceptions/BaseException";
import { makePredicate } from "@/_lib/Predicate";

namespace UnauthorizedException {
  const type = Symbol();
  const code = "UnauthorizedException";
  const message = "Unauthorized";

  export const create = (customMsg?: string) => new BaseException({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { UnauthorizedException };
