import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from '@/_lib/CQRS';

type ArticleListItemDTO = Readonly<{
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  comments: ReadonlyArray<{
    id: string;
    body: string;
    createdAt: Date;
  }>;
}>;

type ArticleFilter = {
  title?: string;
  publishedBetween?: Date[];
};

type FindArticles = QueryHandler<SortedPaginatedQuery<ArticleFilter>, PaginatedQueryResult<ArticleListItemDTO[]>>;

export { FindArticles };
