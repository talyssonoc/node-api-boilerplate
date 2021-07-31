import { AggregateId } from "@/_lib/DDD";

type IdProvider<T extends AggregateId<N>, N = T["value"]> = {
  create(id: N): T;
  validate(id: T): id is T;
};

const makeIdProvider = <T extends AggregateId<N>, N = T["value"]>(): IdProvider<T, N> => {
  const key = Symbol();

  return {
    create: (id: N): T =>
      ({
        value: id,
        [key]: true,
      } as unknown as T),
    validate: (id: T | any): id is T => Boolean(id[key]),
  };
};

export { IdProvider, makeIdProvider };
