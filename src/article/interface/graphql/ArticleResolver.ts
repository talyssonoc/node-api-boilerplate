import { GraphQLResolver } from '@/_lib/graphql/Graphql';

const articleResolver:  GraphQLResolver = async (_, args, context) => {
  const { findArticles } = context.container;
  const { filter, pagination, sort } = args;

  const { data: articles } = await findArticles({ filter, pagination, sort });

  return articles;
};

export { articleResolver };