import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { Article } from '@/article/domain/Article';
import { ApplicationService } from '@/_lib/DDD';
import { BusinessError } from '@/_sharedKernel/domain/error/BusinessError';
import { Logger } from 'pino';

type Dependencies = {
  articleRepository: ArticleRepository;
  logger: Logger;
};

type PublishArticle = ApplicationService<string, void>;

const makePublishArticle =
  ({ articleRepository, logger }: Dependencies): PublishArticle =>
  async (payload: string) => {
    const article = await articleRepository.findById(payload);

    if (Article.isPublished(article)) {
      throw BusinessError.create(
        // eslint-disable-next-line max-len
        `Can't republish the Article(id=${payload}) because it was already published at ${article.publishedAt.toISOString()}`
      );
    }

    const publishedArticle = Article.publish(article);

    await articleRepository.store(publishedArticle);

    logger.info(`[PublishArticle] Article(id=${payload}) published at ${article.publishedAt?.toISOString()}`);
  };

export { makePublishArticle };
export type { PublishArticle };
