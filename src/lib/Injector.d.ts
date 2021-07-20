import { AwilixContainer } from 'awilix';

type Injector = {
  inject: <T>(target: (dependencies: any) => T) => T;
  withContainer: <T>(target: (container: AwilixContainer) => T) => T;
  resolve: <T = any>(key: string) => T;
  withInjector: <T>(target: (injector: Injector) => T) => T;
  container: AwilixContainer<any>;
};

export { Injector };
