import { ArticleCreatedEvent } from '@/article/application/events/ArticleCreatedEvent';
import { ArticleCollection } from '@/article/infrastructure/ArticleCollection';
import { from } from 'uuid-mongodb';
import { eventConsumer } from '@/_lib/pubSub/EventEmitterConsumer';

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeArticleCreatedEmailListener = eventConsumer<ArticleCreatedEvent.Type, Dependencies>(
  ArticleCreatedEvent,
  ({ articleCollection }) =>
    async (event) => {
      const article = await articleCollection.findOne({ _id: from(event.payload.id.value) });

      console.log(article);
    }
);

export { makeArticleCreatedEmailListener };
