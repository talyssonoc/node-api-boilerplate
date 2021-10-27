import { GraphQLContext } from '@/_boot/graphql';
import { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql';

type Sort = Readonly<{
  field: string;
  direction: 'asc' | 'desc';
}>;

type Pagination = Readonly<{
  page: number;
  pageSize: number;
}>;

type Filter = Record<string, any>;

type Args = {
  pagination: Pagination;
  filter: Filter;
  sort: Sort[];
}

type GraphQLResolver = GraphQLFieldResolver<any, GraphQLContext, Args>

type GraphQLQueryMap<TSource, TContext> = {
  [key: string]: GraphQLFieldConfig<TSource, TContext, Args>;
} 

export { GraphQLQueryMap, GraphQLResolver };