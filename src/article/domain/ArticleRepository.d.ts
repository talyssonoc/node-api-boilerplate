import { Article } from '@/article/domain/Article'

type ArticleRepository = {
  getNextId(): Promise<string>;
  findById(id: string): Promise<Article.Type>;
  store(entity: Article.Type): Promise<void>;
}

export { ArticleRepository }