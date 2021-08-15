import { ArticleCreatedEvent } from "@/article/application/events/ArticleCreatedEvent";
import { ArticleCollection } from "@/article/infrastructure/ArticleCollection";
import { eventConsumer } from "@/_lib/events/EventConsumer";
import { from } from "uuid-mongodb";

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeArticleCreatedEmailListener = eventConsumer<ArticleCreatedEvent.Type, Dependencies>(
  ArticleCreatedEvent,
  ({ articleCollection }) =>
    async event => {
      const article = await articleCollection.findOne({ _id: from(event.payload.id) });

      console.log(article);
    }
);

export { makeArticleCreatedEmailListener };
