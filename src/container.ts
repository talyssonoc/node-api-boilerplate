import { BuildResolverOptions, createContainer } from 'awilix';
import { MainRegistry } from '@/_boot';
import { makeInitialize } from '@/_lib/Initialize';

type Registry = MainRegistry;

const container = createContainer<Registry>();
const initialize = makeInitialize<Registry, BuildResolverOptions<any>>(container.build);

type Container = typeof container;
type Initialize = typeof initialize;

export { container, initialize };
export type { Container, Registry, Initialize };
