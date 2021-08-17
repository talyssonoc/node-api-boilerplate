import { Event, EventAddress } from "@/_lib/events/Event";

type SubscriberOptions = {
  single: boolean;
  nackOn: (error?: Error) => boolean;
};

type Subscriber<OPTS = SubscriberOptions> = {
  subscribe: <E extends Event<any>>(
    address: EventAddress<E["eventType"], E["topic"]>,
    handler: (event: E) => Promise<void>,
    opts?: Partial<OPTS>
  ) => Promise<void>;
};

export { Subscriber, SubscriberOptions };
