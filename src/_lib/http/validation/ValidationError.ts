import Joi from "types-joi";
import { makePredicate } from "@/_lib/Predicate";

namespace ValidationError {
  const ErrorType = Symbol("ValidationError");

  type Props = {
    readonly target: string;
    readonly error?: Joi.ValidationError;
  };

  class ValidationException extends Error implements Props {
    public readonly type = ErrorType;
    public readonly error?: Joi.ValidationError;
    public readonly target: string;

    constructor({ target, error }: Props) {
      super();
      this.target = target;
      this.error = error;
    }
  }

  export const create = ({ error, target }: Props) => new ValidationException({ target, error });

  export const is = makePredicate<ValidationException>(ErrorType);
}

export { ValidationError };
