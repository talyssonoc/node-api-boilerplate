import { makeEventConsumer } from '@/_lib/events/EventConsumer';
import { key } from '@/_lib/pubSub/EventEmitterPubSub';

const eventConsumer = makeEventConsumer(key);

export { eventConsumer };
