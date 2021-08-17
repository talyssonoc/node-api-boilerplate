import { PaginatedQuery, QueryHandler, QueryResult, SortedPaginatedQuery } from "@/_lib/CQRS";

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

type FindArticles = QueryHandler<void, QueryResult<ArticleListItemDTO[]>>;

export { FindArticles };
