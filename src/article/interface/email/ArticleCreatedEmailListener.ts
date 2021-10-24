import { ArticleCreatedEvent } from '@/article/application/events/ArticleCreatedEvent';
import { ArticleCollection } from '@/article/infrastructure/ArticleCollection';
import { from } from 'uuid-mongodb';
import { eventConsumer } from '@/_lib/pubSub/EventEmitterConsumer';
import { Logger } from 'pino';

type Dependencies = {
  articleCollection: ArticleCollection;
  logger: Logger;
};

const makeArticleCreatedEmailListener = eventConsumer<ArticleCreatedEvent.Type, Dependencies>(
  ArticleCreatedEvent,
  ({ articleCollection, logger }) =>
    async (event) => {
      const article = await articleCollection.findOne({ _id: from(event.payload.id.value) });

      logger.info(article || {});
    }
);

export { makeArticleCreatedEmailListener };
