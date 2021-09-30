import { Article } from '@/article/domain/Article';
import { Event } from '@/_lib/events/Event';
import { v4 } from 'uuid-mongodb';

namespace ArticleCreatedEvent {
  export const topic = 'Article' as const;
  export const eventType = 'ArticleCreatedEvent' as const;

  type ArticleCreatedEvent = Event<Article.Type, typeof eventType, typeof topic>;

  export const create = (article: Article.Type): ArticleCreatedEvent => ({
    eventId: v4().toString(),
    eventType,
    topic,
    payload: article,
  });

  export type Type = ArticleCreatedEvent;
}

export { ArticleCreatedEvent };
