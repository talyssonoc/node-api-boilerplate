import { AwilixContainer } from "awilix";

type Injector = {
  inject: <T>(target: (dependencies: any) => T) => T;
  withContainer: <T>(target: (container: AwilixContainer) => T) => T;
  resolve: <T = any>(key: string) => T;
  withInjector: <T>(target: (injector: Injector) => T) => T;
  container: AwilixContainer<any>;
};

const makeInjector = (container: AwilixContainer): Injector => ({
  inject: target => target(container.cradle),
  withContainer: target => target(container),
  resolve: (key: string) => container.resolve(key),
  withInjector: target => target(makeInjector(container)),
  container,
});

export { Injector, makeInjector };
