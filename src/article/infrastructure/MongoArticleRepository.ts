import { Article } from "@/article/domain/Article";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { ArticleCollection } from "@/article/infrastructure/ArticleCollection";
import MUUID from "uuid-mongodb";

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeMongoArticleRepository = ({ articleCollection }: Dependencies): ArticleRepository => ({
  async getNextId(): Promise<string> {
    return Promise.resolve(MUUID.v4().toString());
  },
  async findById(id: string): Promise<Article.Type> {
    const article = await articleCollection.findOne({ _id: MUUID.from(id), deleted: false });

    if (!article) {
      throw new Error("Article not found");
    }

    return {
      id: MUUID.from(article._id).toString(),
      title: article.title,
      content: article.content,
      state: article.status,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.createdAt,
      version: article.version,
    };
  },
  async store(entity: Article.Type): Promise<void> {
    const count = await articleCollection.countDocuments({ _id: MUUID.from(entity.id), deleted: false });

    if (count) {
      await articleCollection.updateOne(
        { _id: MUUID.from(entity.id), version: entity.version },
        {
          $set: {
            title: entity.title,
            content: entity.content,
            status: entity.state,
            publishedAt: entity.publishedAt,
            createdAt: entity.createdAt,
            deleted: entity.state === "DELETED",
            updatedAt: new Date(),
            version: entity.version + 1,
          },
        }
      );

      return;
    }

    await articleCollection.insertOne({
      _id: MUUID.from(entity.id),
      title: entity.title,
      content: entity.content,
      status: entity.state,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      deleted: entity.state === "DELETED",
      updatedAt: entity.createdAt,
      version: entity.version,
    });
  },
});

export { makeMongoArticleRepository };
