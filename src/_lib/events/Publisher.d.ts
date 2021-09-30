import { Event } from '@/_lib/events/Event';

type Publisher = {
  publish: <T extends Event<any>>(event: T) => Promise<void>;
};

export { Publisher };
