import { Event, EventRoute } from "@/_lib/events/Event";

type Subscriber<OPTS = any> = {
  subscribe: <R extends EventRoute, E extends Event<any>>(
    route: R,
    handler: (event: E) => Promise<void>,
    opts?: OPTS
  ) => Promise<void>;
};

export { Publisher };
