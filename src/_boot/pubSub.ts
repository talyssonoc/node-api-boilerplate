import { makeModule } from '@/context';
import { makeEventEmitterPubSub } from '@/_lib/pubSub/EventEmitterPubSub';
import { asValue } from 'awilix';
import { Subscriber } from '@/_lib/events/Subscriber';
import { Publisher } from '@/_lib/events/Publisher';

const pubSub = makeModule('pubSub', async ({ container: { build, register }, app: { onReady } }) => {
  const eventEmitterPubSub = build(makeEventEmitterPubSub);

  register({
    eventEmitterPubSub: asValue(eventEmitterPubSub),
  });

  onReady(async () => {
    await eventEmitterPubSub.start();
  });

  return async () => {
    await eventEmitterPubSub.dispose();
  };
});

type PubSubRegistry = {
  eventEmitterPubSub: Publisher & Subscriber;
};

export { pubSub };
export type { PubSubRegistry };
