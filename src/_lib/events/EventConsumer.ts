import { Event, EventAddress } from "@/_lib/events/Event";
import { Subscriber, SubscriberOptions } from "@/_lib/events/Subscriber";

const eventConsumer =
  <E extends Event<any>, D extends Record<string, any> | void = void, OPTS = SubscriberOptions>(
    address: EventAddress<E["eventType"], E["topic"]>,
    fn: (deps: D) => (event: E) => Promise<void>,
    opts: Partial<OPTS> = {}
  ) =>
  (deps: D & { subscriber: Subscriber<OPTS> }): void => {
    const { subscriber } = deps;

    subscriber.subscribe(address, fn(deps), opts);
  };

export { eventConsumer };
