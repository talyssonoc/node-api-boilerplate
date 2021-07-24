import { Article } from "@/article/domain/Article";

type MemoryDB = {
  articles: Record<string, Article.Type>;
};

const makeMemoryDB = (): MemoryDB => {
  return {
    articles: {},
  };
};

export { makeMemoryDB, MemoryDB };
