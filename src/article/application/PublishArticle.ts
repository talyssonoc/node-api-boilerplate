import { ArticleRepository } from "../domain/ArticleRepository";
import { Article } from "../domain/Article";

type Dependencies = {
  articleRepository: ArticleRepository;
};

const makePublishArticle =
  ({ articleRepository }: Dependencies) =>
  async (payload: string) => {
    let article = await articleRepository.findById(payload);

    article = Article.publish(article);

    await articleRepository.store(article);
  };

export type PublishArticle = ReturnType<typeof makePublishArticle>;

export { makePublishArticle };
