import { Resolver } from 'awilix/lib/resolvers';
import { asValue } from 'awilix';

type Values = Record<string, any>;

type ContainerValues = <Type extends Values>(values: Type) => { [key in keyof Type]: Resolver<Type[key]> };

const toContainerValues: ContainerValues = (values) =>
  Object.entries(values).reduce((acc: any, [key, value]) => ({ ...acc, [key]: asValue(value) }), {});

export { toContainerValues };
