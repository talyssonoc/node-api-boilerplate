import { GraphQLResolver } from '@/_lib/graphql/Graphql';
import graphqlFields from 'graphql-fields';


const articleResolver:  GraphQLResolver = async (_, args, context, info) => {
  const fields = Object.keys(graphqlFields(info));
  const { findArticles } = context.registry;
  const { filter, pagination, sort } = args;

  const { data: articles } = await findArticles({ filter, pagination, sort, fields});

  return articles;
};

export { articleResolver };