import { Event } from "@/_lib/events/Event";

type Publisher<OPTS = void> = {
  publish: <T extends Event<any>>(event: T, opts?: OPTS) => Promise<void>;
};

export { Publisher };
