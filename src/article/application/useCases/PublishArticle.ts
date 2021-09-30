import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { Article } from '@/article/domain/Article';
import { ApplicationService } from '@/_lib/DDD';
import { BusinessError } from '@/_sharedKernel/domain/error/BusinessError';
import { MessageBundle } from '@/messages';
import { Logger } from 'pino';

type Dependencies = {
  articleRepository: ArticleRepository;
  logger: Logger;
  messageBundle: MessageBundle;
};

type PublishArticle = ApplicationService<string, void>;

const makePublishArticle =
  ({ articleRepository, logger, messageBundle: { getMessage, useBundle } }: Dependencies): PublishArticle =>
  async (payload: string) => {
    const article = await articleRepository.findById(payload);

    if (Article.isPublished(article)) {
      throw BusinessError.create(
        useBundle('article.error.alreadyPublished', { id: payload, publishedAt: article.publishedAt })
      );
    }

    const publishedArticle = Article.publish(article);

    await articleRepository.store(publishedArticle);

    logger.info(
      getMessage('article.published', { id: publishedArticle.id.value, publishedAt: publishedArticle.publishedAt })
    );
  };

export { makePublishArticle };
export type { PublishArticle };
