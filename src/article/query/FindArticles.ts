import { ArticleCollection } from "@/article/infrastructure/ArticleCollection";
import { MemoryDB } from "@/article/infrastructure/MemoryDB";

type Dependencies = {
  memoryDB: MemoryDB;
};

type ArticleListItemDTO = {
  id: string;
  title: string;
  publishedAt: Date;
};

const makeFindArticles =
  ({ memoryDB }: Dependencies) =>
  async (): Promise<ArticleListItemDTO[]> => {
    const articles = Object.values(memoryDB.articles).filter(article => article.state === "PUBLISHED");

    return articles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      publishedAt: article.publishedAt!,
    }));
  };

export type FindArticles = ReturnType<typeof makeFindArticles>;

export { makeFindArticles };
