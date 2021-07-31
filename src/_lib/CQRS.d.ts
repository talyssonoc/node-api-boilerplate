type Sort = Readonly<{
  field: string;
  direction: "asc" | "desc";
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

type Filter = {};

export type Query<F = void> = F extends Filter
  ? Readonly<{
      filter: F;
    }>
  : {};

export type PaginatedQuery<F = void> = Query<F> &
  Readonly<{
    pagination: Pagination;
  }>;

export type SortedQuery<F = void> = Query<F> &
  Readonly<{
    sort: Sort[];
  }>;

export type SortedPaginatedQuery<F = void> = Query<F> &
  Readonly<{
    sort: Sort[];
    pagination: Pagination;
  }>;

export type QueryResult<T> = Readonly<{
  data: T;
}>;

export type PaginatedQueryResult<T> = QueryResult<T> &
  Readonly<{
    page: ResultPage;
  }>;

export type QueryHandler<P extends Query<any> | void, R extends QueryResult<any>> = (payload: P) => Promise<R>;
