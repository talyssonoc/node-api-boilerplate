import { makePredicate } from "@/_lib/Predicate";
import { BaseException, Exception } from "@/_lib/exceptions/BaseException";

namespace NotFoundException {
  const type = Symbol();
  const code = "NotFoundException";
  const message = "No %s was found for id %s.";

  export const create = (customMsg?: string) => new BaseException({ type, code, message: customMsg || message });

  export const is = makePredicate<Exception>(type);
}

export { NotFoundException };
