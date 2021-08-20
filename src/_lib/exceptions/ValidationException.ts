import Joi from "types-joi";
import { BaseException, Exception } from "@/_lib/exceptions/BaseException";
import { makePredicate } from "@/_lib/Predicate";

namespace ValidationException {
  const type = Symbol();
  const code = "ValidationException";

  type Props = {
    readonly target: string;
    readonly error: Joi.ValidationError;
  };

  export const create = ({ error, target }: Props) =>
    new BaseException<Props>({ type, code, message: error.message, meta: { target, error } });

  export const is = makePredicate<Exception<Props>>(type);
}

export { ValidationException };
