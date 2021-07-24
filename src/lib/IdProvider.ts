import { AggregateId } from "@/lib/ddd";

type IdProvider<T extends AggregateId<N>, N = T["value"]> = {
  create(id: N): T;
  validate(id: T): boolean;
};

const makeIdProvider = <T extends AggregateId<N>, N = T["value"]>(): IdProvider<T, N> => {
  const key = Symbol();

  return {
    create(id: N): T {
      return {
        value: id,
        [key]: true,
      } as unknown as T;
    },
    validate(id: T): boolean {
      return Boolean(id[key]);
    },
  };
};

export { IdProvider, makeIdProvider };
