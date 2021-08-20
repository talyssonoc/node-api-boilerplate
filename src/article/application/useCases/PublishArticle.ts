import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { Article } from "@/article/domain/Article";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  articleRepository: ArticleRepository;
};

type PublishArticle = ApplicationService<string, void>;

const makePublishArticle =
  ({ articleRepository }: Dependencies): PublishArticle =>
  async (payload: string) => {
    const article = await articleRepository.findById(payload);

    if (Article.isPublished(article)) {
      throw BusinessError.create("article.already.published").withParameters({
        id: article.id.value,
        publishedAt: article.publishedAt,
      });
    }

    const publishedArticle = Article.publish(article);

    await articleRepository.store(publishedArticle);
  };

export { makePublishArticle };
export type { PublishArticle };
