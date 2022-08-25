import { Article } from '@/article/domain/Article';
import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { ArticleCollection } from '@/article/infrastructure/ArticleCollection';
import { ArticleMapper } from '@/article/infrastructure/ArticleMapper';
import { NotFoundError } from '@/_lib/errors/NotFoundError';
import { ArticleId } from '@/_sharedKernel/domain/ArticleId';
import { ArticleIdProvider } from '@/_sharedKernel/infrastructure/ArticleIdProvider';
import { from, v4 } from 'uuid-mongodb';

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeMongoArticleRepository = ({ articleCollection }: Dependencies): ArticleRepository => ({
  async getNextId(): Promise<ArticleId> {
    return Promise.resolve(ArticleIdProvider.create(v4().toString()));
  },
  async findById(id: string): Promise<Article.Type> {
    const article = await articleCollection.findOne({ _id: from(id), deleted: false });

    if (!article) {
      throw NotFoundError.create();
    }

    return ArticleMapper.toEntity(article);
  },
  async store(entity: Article.Type): Promise<void> {
    const { _id, version, ...data } = ArticleMapper.toData(entity);

    const count = await articleCollection.countDocuments({ _id });

    if (count) {
      await articleCollection.updateOne(
        { _id, version, deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
            version: version + 1,
          },
        }
      );

      return;
    }

    await articleCollection.insertOne({
      _id,
      ...data,
      version,
    });
  },
});

export { makeMongoArticleRepository };
