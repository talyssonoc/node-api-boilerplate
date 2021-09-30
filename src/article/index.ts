import { asFunction } from 'awilix';
import { CreateArticle, makeCreateArticle } from '@/article/application/useCases/CreateArticle';
import { DeleteArticle, makeDeleteArticle } from '@/article/application/useCases/DeleteArticle';
import { makePublishArticle, PublishArticle } from '@/article/application/useCases/PublishArticle';
import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { ArticleCollection, initArticleCollection } from '@/article/infrastructure/ArticleCollection';
import { makeMongoArticleRepository } from '@/article/infrastructure/MongoArticleRepository';
import { makeArticleController } from '@/article/interface/http/articleController';
import { FindArticles } from '@/article/query/FindArticles';
import { withMongoProvider } from '@/_lib/MongoProvider';
import { toContainerValues } from '@/_lib/di/containerAdapters';
import { makeMongoFindArticles } from '@/article/query/impl/MongoFindArticles';
import { makeModule } from '@/context';
import { makeArticleCreatedEmailListener } from '@/article/interface/email/ArticleCreatedEmailListener';
import { articleMessages } from '@/article/messages';

const articleModule = makeModule(
  'article',
  async ({ container: { register, build }, messageBundle: { updateBundle } }) => {
    const collections = await build(
      withMongoProvider({
        articleCollection: initArticleCollection,
      })
    );

    updateBundle(articleMessages);

    register({
      ...toContainerValues(collections),
      articleRepository: asFunction(makeMongoArticleRepository),
      createArticle: asFunction(makeCreateArticle),
      publishArticle: asFunction(makePublishArticle),
      deleteArticle: asFunction(makeDeleteArticle),
      findArticles: asFunction(makeMongoFindArticles),
    });

    build(makeArticleController);
    build(makeArticleCreatedEmailListener);
  }
);

type ArticleRegistry = {
  articleCollection: ArticleCollection;
  articleRepository: ArticleRepository;
  createArticle: CreateArticle;
  publishArticle: PublishArticle;
  deleteArticle: DeleteArticle;
  findArticles: FindArticles;
};

export { articleModule };
export type { ArticleRegistry };
