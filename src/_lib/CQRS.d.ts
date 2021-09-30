type Sort = Readonly<{
  field: string;
  direction: 'asc' | 'desc';
}>;

type Pagination = Readonly<{
  page: number;
  pageSize: number;
}>;

type ResultPage = Readonly<{
  current: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}>;

type Filter = Record<string, any>;

type Query<F = void> = F extends Filter
  ? Readonly<{
      filter: F;
    }>
  : never;

type PaginatedQuery<F = void> = Query<F> &
  Readonly<{
    pagination: Pagination;
  }>;

type SortedQuery<F = void> = Query<F> &
  Readonly<{
    sort: Sort[];
  }>;

type SortedPaginatedQuery<F = void> = Query<F> &
  Readonly<{
    sort: Sort[];
    pagination: Pagination;
  }>;

type QueryResult<T> = Readonly<{
  data: T;
}>;

type PaginatedQueryResult<T> = QueryResult<T> &
  Readonly<{
    page: ResultPage;
  }>;

type QueryHandler<P extends Query<any> | void, R extends QueryResult<any>> = (payload: P) => Promise<R>;

export { Query, PaginatedQuery, SortedQuery, SortedPaginatedQuery, QueryResult, PaginatedQueryResult, QueryHandler };
