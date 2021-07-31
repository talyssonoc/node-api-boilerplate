import { Article } from "@/article/domain/Article";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { MemoryDB } from "@/article/infrastructure/MemoryDB";
import MUUID from "uuid-mongodb";

type Dependencies = {
  memoryDB: MemoryDB;
};

const makeInMemoryArticleRepository = ({ memoryDB }: Dependencies): ArticleRepository => {
  return {
    async getNextId(): Promise<string> {
      return Promise.resolve(MUUID.v4().toString());
    },
    async findById(id: string): Promise<Article.Type> {
      const article = memoryDB.articles[id];

      if (!article) {
        throw new Error(`Article not found for id ${id}`);
      }

      return Promise.resolve(article);
    },
    async store(article: Article.Type): Promise<void> {
      memoryDB.articles[article.id] = {
        ...article,
      };

      return Promise.resolve();
    },
  };
};

export { makeInMemoryArticleRepository };
