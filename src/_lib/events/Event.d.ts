type EventAddress<ET extends string = string, T extends string = string> = Readonly<{
  eventType: ET;
  topic: T;
}>;

type Event<P, ET extends string = string, T extends string = string> = EventAddress<ET, T> &
  Readonly<{
    eventId: string;
    payload: P;
  }>;

export { Event, EventAddress };
