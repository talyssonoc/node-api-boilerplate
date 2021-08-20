import { Event } from "@/_lib/events/Event";

type Scheduler<OPTS = void> = {
  add: <E extends Event<any>>(handler: (event: E) => Promise<void>, opts?: Partial<OPTS>) => Promise<void>;

  start: () => Promise<void>;

  dispose: () => Promise<void>;
};

export { Subscriber, SubscriberOptions };
