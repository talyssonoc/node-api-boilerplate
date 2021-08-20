import { BaseError, Exception } from "@/_lib/errors/BaseError";
import { makePredicate } from "@/_lib/Predicate";
import { MessageParameters } from "@/messageSource";

namespace BusinessError {
  const type = Symbol();
  const code = "BusinessError";

  export const create = (message: keyof MessageParameters) =>
    new BaseError<Exception, MessageParameters[typeof message]>({ type, code, message });

  export const is = makePredicate<Exception>(type);
}

export { BusinessError };
