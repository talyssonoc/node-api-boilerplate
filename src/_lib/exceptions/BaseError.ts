import { format } from "util";

type Exception<M = any> = Readonly<{
  type: symbol;
  message: string;
  code: string;
  meta?: M;
}>;

type MessageFormatter<T> = (message: string, params?: T) => string;

const defaultFormatter = <T>(message: string, params?: T) => format(message, params);

class BaseError<M = any, T = (string | number)[]> extends Error implements Exception<M> {
  public readonly type: symbol;
  public readonly code: string;
  public readonly meta?: M;

  private readonly _message: string;
  private parameters?: T;

  private formatter: MessageFormatter<T>;

  constructor(props: Exception<M>, formatter: MessageFormatter<T> = defaultFormatter) {
    super();
    this.name = props.code;
    this.type = props.type;
    this.code = props.code;
    this.meta = props.meta;
    this._message = props.message;
    this.formatter = formatter;

    Error.captureStackTrace(this, BaseError);
  }

  get message(): string {
    return this.formatter(this._message, this.parameters);
  }

  public withParameters(parameters: T): BaseError<M, T> {
    this.parameters = parameters;
    return this;
  }
}

export { BaseError };
export type { Exception };
