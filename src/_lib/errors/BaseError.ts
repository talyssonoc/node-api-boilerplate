import { PartializeProperties } from '@/_lib/PartializeProperties';

type Exception<M = any> = Readonly<{
  name: string;
  type: symbol;
  message: string;
  code: string;
  meta?: M;
}>;

type Props<M = any> = PartializeProperties<Exception<M>, 'name'>;

class BaseError<M = any> extends Error implements Exception<M> {
  public readonly type: symbol;
  public readonly code: string;
  public readonly meta?: M;

  constructor(props: Props<M>) {
    super();
    this.name = props.name || props.code;
    this.type = props.type;
    this.code = props.code;
    this.meta = props.meta;
    this.message = props.message;

    Error.captureStackTrace(this, BaseError);
  }
}

export { BaseError };
export type { Exception };
