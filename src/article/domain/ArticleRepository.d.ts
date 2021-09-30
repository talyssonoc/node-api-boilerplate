import { Article } from '@/article/domain/Article';
import { Repository } from '@/_lib/DDD';

type ArticleRepository = Repository<Article.Type> & {
  findById(id: string): Promise<Article.Type>;
};

export { ArticleRepository };
