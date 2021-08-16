import { Event, EventRoute } from "@/_lib/events/Event";
import EventEmitter from "events";

type ConsumerOptions = {
  single: boolean;
  nackOn: (error?: Error) => boolean;
};

const defaultOptions: ConsumerOptions = {
  single: false,
  nackOn: () => true,
};

const eventConsumer =
  <E extends Event<any>, D extends Record<string, any> | void = void>(
    eventResolver: EventRoute<E["eventType"], E["topic"]>,
    fn: (deps: D) => (event: E) => Promise<void>,
    opts: Partial<ConsumerOptions> = {}
  ) =>
  (deps: D & { publisher: EventEmitter }): void => {
    const { publisher } = deps;
    const { single, nackOn } = { ...defaultOptions, ...opts };

    publisher[single ? "once" : "on"](`${eventResolver.topic}.${eventResolver.eventType}`, fn(deps));
  };

export { eventConsumer };
