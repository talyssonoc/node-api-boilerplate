import { ArticleRepository } from "../../domain/ArticleRepository";
import { Article } from "../../domain/Article";

type Dependencies = {
  articleRepository: ArticleRepository;
};

const makeDeleteArticle =
  ({ articleRepository }: Dependencies) =>
  async (payload: string) => {
    let article = await articleRepository.findById(payload);

    article = Article.markAsDeleted(article);

    await articleRepository.store(article);
  };

export type DeleteArticle = ReturnType<typeof makeDeleteArticle>;

export { makeDeleteArticle };
