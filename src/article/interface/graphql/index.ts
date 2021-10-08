import { GraphQLContext,GraphQLQueryMap } from '@/_lib/graphql/Graphql';

import { ArticleType } from './ArticleTypeDef';
import { articleResolver } from './ArticleResolver';
import { ArticleSchema } from '@/article/infrastructure/ArticleCollection';
import { PaginationType, SortType } from '@/_sharedKernel/interface/graphql/TypeDefs';
import { GraphQLInputObjectType, GraphQLList, GraphQLString } from 'graphql';

type ArticleQueries = GraphQLQueryMap<ArticleSchema, GraphQLContext>;

const articleQueries: ArticleQueries = {
  articles: {
    type: ArticleType,
    args: {
      filter: {
        type: new GraphQLInputObjectType({
          name: 'ArticleFilter',
          fields: () => ({
            title: {
              type: GraphQLString,
              defaultValue: ''
            },
            publishedBetween: {
              type: GraphQLList(GraphQLString),
              defaultValue: []
            }
          })
        })
      },
      sort: {
        type: SortType,
      },
      pagination: {
        type: PaginationType,
      }
    },
    resolve: articleResolver,
  },
};

export { articleQueries };
export type { ArticleQueries };