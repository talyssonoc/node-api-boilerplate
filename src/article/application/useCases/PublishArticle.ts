import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { Article } from "@/article/domain/Article";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  articleRepository: ArticleRepository;
};

type PublishArticle = ApplicationService<string, void>;

const makePublishArticle =
  ({ articleRepository }: Dependencies): PublishArticle =>
  async (payload: string) => {
    let article = await articleRepository.findById(payload);

    article = Article.publish(article);

    await articleRepository.store(article);
  };

export { makePublishArticle };
export type { PublishArticle };
