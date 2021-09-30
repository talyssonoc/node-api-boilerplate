import { AggregateRoot } from '@/_lib/DDD';
import assertFn from 'assert';

type AssertionFn = (value: any, message?: string | Error) => void;

type InvariantCheckFn<A> = (self: A, assert: AssertionFn) => void;

const makeWithInvariants =
  <A extends AggregateRoot<any>>(invariantCheckFn: InvariantCheckFn<A>) =>
  <F extends (...args: any[]) => A>(fn: F) =>
  (...args: Parameters<F>): ReturnType<F> => {
    const self = fn(...args);
    invariantCheckFn(self, assertFn);

    return self as ReturnType<F>;
  };

export { makeWithInvariants };
export type { AssertionFn };
