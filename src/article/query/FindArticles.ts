import { ArticleCollection } from '@/article/infrastructure/ArticleCollection';

type Dependencies = {
  articleCollection: ArticleCollection;
}

type ArticleListItemDTO = {
  id: string;
  title: string;
  publishedAt: Date;
}

const makeFindArticles = ({ articleCollection }: Dependencies) => async (): Promise<ArticleListItemDTO[]> => {
  const articles = await articleCollection.find({
    status: 'PUBLISHED'
  }).sort('publishedAt').toArray();

  return articles.map(article => ({
    id: article._id.toString(),
    title: article.title,
    publishedAt: article.publishedAt!
  }));
}

export { makeFindArticles }