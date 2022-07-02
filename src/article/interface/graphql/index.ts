import { GraphQLInputObjectType, GraphQLList, GraphQLString } from 'graphql';

import { GraphQLContext } from '@/_boot/graphql';
import { GraphQLQueryMap } from '@/_lib/graphql/Graphql';
import { PaginationType, SortType } from '@/_sharedKernel/interface/graphql/TypeDefs';
import { ArticleSchema } from '@/article/infrastructure/ArticleCollection';

import { ArticleType } from './ArticleTypeDef';
import { articleResolver } from './ArticleResolver';

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