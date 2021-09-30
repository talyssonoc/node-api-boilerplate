const makePredicate =
  <T>(value: symbol | string | any, key: string | symbol = 'type') =>
  (obj: T | any): obj is T =>
    obj[key] === value;

export { makePredicate };
