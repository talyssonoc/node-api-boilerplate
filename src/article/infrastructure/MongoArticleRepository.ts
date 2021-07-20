import Article from '@/article/domain/Article';
import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { ArticleCollection } from '@/article/infrastructure/ArticleCollection';
import { ObjectId } from 'mongodb';

type Dependencies = {
  articleCollection: ArticleCollection
}

const makeMongoArticleRepository = ({ articleCollection }: Dependencies): ArticleRepository => ({
  async getNextId(): Promise<string> {
    return Promise.resolve(ObjectId.generate().toString());
  },
  async findById(id: string): Promise<Article> {
    const article = await articleCollection.findOne({ _id: id });

    if (!article) {
      throw new Error('Article not found');
    }

    return {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      state: article.status,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.createdAt,
      version: article.version
    }
  },
  async store(entity: Article): Promise<void> {
    const count = await articleCollection.countDocuments({ _id: entity.id });

    if (count) {
      await articleCollection.updateOne(
        { _id: entity.id },
        { $set: {
          title: entity.title,
          content: entity.content,
          status: entity.state,
          publishedAt: entity.publishedAt,
          createdAt: entity.createdAt,
          updatedAt: entity.createdAt,
          version: entity.version
        }
      }
      )
    }

    await articleCollection.insertOne({
      _id: entity.id,
      title: entity.title,
      content: entity.content,
      status: entity.state,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.createdAt,
      version: entity.version
    });
  }
});

export { makeMongoArticleRepository }