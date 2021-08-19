import { makePredicate } from "@/_lib/Predicate";

namespace NotFoundError {
  const ErrorType = Symbol("NotFoundError");

  type Props = {
    readonly target: string;
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

export class NotFoundException extends HttpException {
  constructor(message?: string | Record<string, any>, error = "Not Found") {
    super({ message, error }, HttpStatus.NOT_FOUND);
  }
}
