import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { Article } from '@/article/domain/Article';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
  articleRepository: ArticleRepository;
};

type DeleteArticle = ApplicationService<string, void>;

const makeDeleteArticle =
  ({ articleRepository }: Dependencies): DeleteArticle =>
  async (payload: string) => {
    let article = await articleRepository.findById(payload);

    article = Article.markAsDeleted(article);

    await articleRepository.store(article);
  };

export { makeDeleteArticle };
export type { DeleteArticle };
