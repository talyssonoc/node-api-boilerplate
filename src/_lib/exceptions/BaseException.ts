import { format } from "util";

type Exception<M = any> = Readonly<{
  type: symbol;
  message: string;
  code: string;
  meta?: M;
}>;

class BaseException<M = any> extends Error implements Exception<M> {
  public readonly type: symbol;
  public readonly code: string;
  public readonly meta?: M;

  private readonly _message: string;
  private parameters: (string | number)[] = [];

  constructor(props: Exception<M>) {
    super();
    this.name = props.code;
    this.type = props.type;
    this.code = props.code;
    this.meta = props.meta;
    this._message = props.message;
  }

  get message(): string {
    return format(this._message, ...this.parameters);
  }

  public withParameters(...parameters: (string | number)[]): BaseException<M> {
    this.parameters = [...parameters];
    return this;
  }
}

export { BaseException };
export type { Exception };
