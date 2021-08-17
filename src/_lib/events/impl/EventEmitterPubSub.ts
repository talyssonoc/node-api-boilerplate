import { Publisher } from "@/_lib/events/Publisher";
import { Subscriber, SubscriberOptions } from "@/_lib/events/Subscriber";
import { EventEmitter } from "stream";

const defaultOpts: SubscriberOptions = {
  nackOn: () => true,
  single: false,
};

const makeEventEmitterPubSub = (): Publisher & Subscriber => {
  const emitter = new EventEmitter();

  return {
    publish: async (event) => {
      emitter.emit(`${event.topic}.${event.eventType}`, event);
    },
    subscribe: async (address, handler, opts = {}) => {
      const { single, nackOn } = { ...defaultOpts, ...opts };

      emitter[single ? "once" : "on"](`${address.topic}.${address.eventType}`, async (event) => {
        try {
          await handler(event);
        } catch (err) {
          if (nackOn(err)) {
            throw err;
          }

          console.error(err);
        }
      });
    },
  };
};

export { makeEventEmitterPubSub };
