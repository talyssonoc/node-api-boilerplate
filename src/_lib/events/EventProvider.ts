import { ApplicationService } from '@/_lib/DDD';
import { Event } from '@/_lib/events/Event';
import { Publisher } from '@/_lib/events/Publisher';

type Enqueue = <E extends Event<any>>(event: E) => void;

type EventStore = {
  enqueue: Enqueue;
  getEvents: () => ReadonlyArray<Event<any>>;
};

const makeEventProvider =
  <S extends string = 'publisher'>(publisherKey: S = 'publisher' as S) =>
  <D extends Record<string, any>, AS extends ApplicationService<any, any>>(fn: (deps: D, enqueue: Enqueue) => AS) =>
  (deps: D & { [key in S]: Publisher }): AS => {
    const { [publisherKey]: publisher } = deps;
    const { getEvents, enqueue } = makeEventStore();

    const service = fn(deps, enqueue);

    const wrapper = async (arg) => {
      const result = await service(arg);

      getEvents().forEach((event) => publisher.publish(event));

      return result;
    };

    return wrapper as AS;
  };

const makeEventStore = (): EventStore => {
  let eventStore: Event<any>[] = [];

  return {
    enqueue: <E extends Event<any>>(event: E) => {
      eventStore = [...eventStore, event];
    },
    getEvents: () => [...eventStore],
  };
};

const eventProvider = makeEventProvider();

export { eventProvider, makeEventProvider };
