import { ArticleRepository } from '../domain/ArticleRepository';
import * as Article from '../domain/Article';

type Dependencies = {
  articleRepository: ArticleRepository;
}

type CreateArticleDTO = {
  title: string;
  content: string;
}

const makeCreateArticle = ({ articleRepository }: Dependencies) => async (payload: CreateArticleDTO) => {
  const id = await articleRepository.getNextId();

  const article = Article.create({
    id,
    title: payload.title,
    content: payload.content
  });

  await articleRepository.store(article);

  return id;
}

type CreateArticle = ReturnType<typeof makeCreateArticle>;

export { makeCreateArticle, CreateArticle }
