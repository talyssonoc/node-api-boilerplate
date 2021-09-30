import _ from 'lodash';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

type MessageParameters = {
  [key: string]: Record<string, any>;
};

type MessageSource<T extends MessageParameters> = {
  [key in keyof T]: T[key] extends Record<string, any>
    ? Exclude<T[key][keyof T[key]], Record<string, any>> extends never
      ? MessageSource<T[key]>
      : Exclude<T[key][keyof T[key]], Record<string, any>> extends boolean | Date | string | number | any[]
      ? string
      : MessageSource<T[key]>
    : string;
};

type None = ['no', 'arguements'];

type JoinParameters<T extends string[] | any[], D extends string> = T extends []
  ? never
  : T extends [infer F, infer U]
  ? F extends string
    ? U extends None
      ? Record<F, void>
      : U extends Record<string, any>
      ? Record<F, U>
      : never
    : never
  : T extends [infer F, infer S, ...infer R]
  ? F extends string
    ? R extends [...infer U]
      ? S extends string
        ? JoinParameters<[`${F}${D}${S}`, ...U], D>
        : never
      : never
    : never
  : string;

type FlattenRecord<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: Exclude<T[K][keyof T[K]], Record<string, any>> extends never
        ? [K, ...FlattenRecord<T[K]>]
        : Exclude<T[K][keyof T[K]], Record<string, any>> extends boolean | Date | string | number | any[]
        ? [K, T[K]]
        : [K, ...FlattenRecord<T[K]>];
    }[Extract<keyof T, string>];

type DeepPartial<T> = {
  [key in keyof T]?: T[key] extends Record<string, any> ? DeepPartial<T[key]> : T[key];
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type FlattenParameters<T extends MessageParameters> = UnionToIntersection<JoinParameters<FlattenRecord<T>, '.'>>;

type TuplefyKeys<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...TuplefyKeys<T[K]>];
    }[Extract<keyof T, string>];

type DotNotation<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${DotNotation<Extract<R, string[]>, D>}`
    : never
  : string;

type FlattenMessageSource<T extends MessageSource<any>> = Record<DotNotation<TuplefyKeys<T>, '.'>, string>;

type MessageBundle<T extends MessageParameters> = {
  getMessage: <K extends keyof FlattenParameters<T>>(
    key: K,
    ...parameters: FlattenParameters<T>[K] extends void ? [undefined?] : [FlattenParameters<T>[K]]
  ) => string;
  updateBundle: (
    newMessageSrc: DeepPartial<MessageSource<T>> | Partial<FlattenMessageSource<MessageSource<T>>>
  ) => void;
  useBundle: <K extends keyof FlattenParameters<T>>(
    key: K,
    ...parameters: FlattenParameters<T>[K] extends void ? [undefined?] : [FlattenParameters<T>[K]]
  ) => { message: string; template: string | null; key: K; parameters?: FlattenParameters<T>[K] };
};

const flatten = (object: Record<string, any>, prevKey = ''): Record<string | number | symbol, string> =>
  Object.entries(object).reduce(
    (acc, [key, item]) => ({
      ...acc,
      ...(typeof item === 'object'
        ? flatten(item, prevKey ? `${prevKey}.${key}` : key)
        : { [prevKey ? `${prevKey}.${key}` : key]: item }),
    }),
    {}
  );

const compile = (object: Record<string, string>): Record<string | number | symbol, (...args: any[]) => string> =>
  Object.entries(object).reduce(
    (acc, [key, item]) => ({
      ...acc,
      [key]: _.template(item),
    }),
    {}
  );

const messageSource = <T extends MessageParameters>(
  src: MessageSource<T> | FlattenMessageSource<MessageSource<T>>
): typeof src => src;

const makeMessegeBundle = <T extends MessageParameters>(
  messageSrc: DeepPartial<MessageSource<T>> | Partial<FlattenMessageSource<MessageSource<T>>> = {}
): MessageBundle<T> => {
  let templateBundle = flatten(messageSrc);
  let compiledBundle = compile(templateBundle);

  const getMessage = <K extends keyof FlattenParameters<T>>(
    key: K,
    ...parameters: FlattenParameters<T>[K] extends void ? [undefined?] : [FlattenParameters<T>[K]]
  ) => {
    const message = compiledBundle[key];

    if (!message) {
      return '';
    }

    return message(...parameters);
  };
  const updateBundle = (
    newMessageSrc: DeepPartial<MessageSource<T>> | Partial<FlattenMessageSource<MessageSource<T>>>
  ) => {
    const flattenedBundle = flatten(newMessageSrc);
    templateBundle = { ...templateBundle, ...flattenedBundle };
    compiledBundle = { ...compiledBundle, ...compile(flattenedBundle) };
  };

  const useBundle = <K extends keyof FlattenParameters<T>>(
    key: K,
    ...parameters: FlattenParameters<T>[K] extends void ? [undefined?] : [FlattenParameters<T>[K]]
  ) => {
    return {
      message: getMessage(key, ...parameters),
      key,
      template: templateBundle[key],
      parameters: parameters[0],
    };
  };

  return {
    getMessage,
    updateBundle,
    useBundle,
  };
};

export { makeMessegeBundle, messageSource };
export type { MessageParameters, FlattenParameters, None };
