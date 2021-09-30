import { Article } from '@/article/domain/Article';
import { Comment } from '@/comment/domain/Comment';

type MemoryDB = {
  articles: Record<string, Article.Type>;
  comments: Record<string, Comment.Type>;
};

const makeMemoryDB = (): MemoryDB => {
  return {
    articles: {},
    comments: {},
  };
};

export { makeMemoryDB };
export type { MemoryDB };
