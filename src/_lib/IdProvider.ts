import { AggregateId } from '@/_lib/DDD';

type IdProvider<T extends AggregateId<N>, N = T['value']> = {
  create(id: N): T;
  ensure(id: T): id is T;
  validate(id: T): void;
};

const makeIdProvider = <T extends AggregateId<N>, N = T['value']>(idName: string): IdProvider<T, N> => {
  const key = Symbol();

  return {
    create: (id: N): T =>
      ({
        value: id,
        [key]: true,
      } as unknown as T),
    ensure: (id: T | any): id is T => Boolean(id[key]),
    validate: (id: T) => {
      if (!id[key]) {
        throw new TypeError(`${id.value} is not a valid ${idName}`);
      }
    },
  };
};

export { makeIdProvider };
export type { IdProvider };
