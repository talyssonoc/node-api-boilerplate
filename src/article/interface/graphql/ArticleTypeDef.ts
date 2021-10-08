import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLString,
} from 'graphql';

import { GraphQLContext } from '@/_lib/graphql/Graphql';
import { ArticleListItemDTO } from '@/article/query/FindArticles';

type ArticlesConfigType = GraphQLObjectTypeConfig<ArticleListItemDTO, GraphQLContext>;

const CommentType  = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'The comment Id',
      resolve: comment => comment.id,
    }, 
    body: {
      type: GraphQLString,
      description: 'The comment body',
      resolve: comment => comment.body,
    },
    createdAt: {
      type: GraphQLString,
      description: 'The date the comment was wrote',
      resolve: comment => comment.createAt
    },
  })
})

const ArticleTypeConfig: ArticlesConfigType = {
  name: 'Article',
  description: 'A blog post article',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The page Id',
      resolve: article => article.id,
    },
    title: {
      type: GraphQLString,
      description: 'The article title',
      resolve: article => article.title,
    },
    content: {
      type: GraphQLString,
      description: 'The article content',
      resolve: article => article.content,
    },
    publishedAt: {
      type: GraphQLString,
      description: 'The date the article was published',
      resolve: article => article.publishedAt
    },
    comments: {
      type: GraphQLList(CommentType),
      description: 'The article comments',
      resolve: article => article.comments,
    },
  }),
};

const ArticleType = GraphQLList(new GraphQLObjectType(ArticleTypeConfig));

export { ArticleType };
