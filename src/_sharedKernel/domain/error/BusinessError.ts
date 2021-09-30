import { BaseError, Exception } from '@/_lib/errors/BaseError';
import { makePredicate } from '@/_lib/Predicate';

namespace BusinessError {
  const type = Symbol();
  const code = 'BusinessError';

  type Props = {
    key: string;
    template: string | null;
    parameters?: any;
  };

  export const create = ({ key, message, template, parameters }: Props & { message: string }): Exception<Props> =>
    new BaseError<Props>({ type, code, message, meta: { key, template, parameters } });

  export const is = makePredicate<Exception<Props>>(type);
}

export { BusinessError };
