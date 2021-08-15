import { Event, EventResolver } from "@/_lib/events/Event";

type Subscriber<OPTS = undefined> = {
  subscribe: <T extends EventResolver<any>, E extends Event<any>>(
    resolve: T,
    handler: (event: E) => Promise<void>,
    opts?: OPTS
  ) => Promise<void>;
};

export { Publisher };
