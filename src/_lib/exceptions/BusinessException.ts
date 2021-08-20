import { BaseException, Exception } from "@/_lib/exceptions/BaseException";
import { makePredicate } from "@/_lib/Predicate";

namespace BusinessException {
  const type = Symbol();
  const code = "BusinessException";

  export const create = (message: string) => new BaseException({ type, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BusinessException };
