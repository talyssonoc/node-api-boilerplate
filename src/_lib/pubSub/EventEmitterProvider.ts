import { makeEventProvider } from '@/_lib/events/EventProvider';
import { key } from '@/_lib/pubSub/EventEmitterPubSub';

const eventProvider = makeEventProvider(key);

export { eventProvider };
