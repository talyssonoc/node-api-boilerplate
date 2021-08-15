type EventResolver<ET extends string, T extends string> = Readonly<{
  eventType: ET;
  topic: T;
}>;

type Event<P, ET extends string = string, T extends string = string> = EventResolver<ET, T> & Readonly<{
  eventId: string;
  payload: P;
}>;

export { Event, EventResolver };
