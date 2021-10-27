import { asValue } from 'awilix';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import { makeSchema, AddToSchema } from '@/_lib/graphql/schema';
import { makeModule } from '@/context';
import { Registry } from '@/container';

const graphql = makeModule('graphql', async ({ app: { onBooted }, container: { build, register, cradle }, config }) => {
  const { getSchema, addToSchema } = makeSchema();

  onBooted(async () => {
    const { queries } = getSchema();

    build(({ server }) => {
      server.use(
        '/graphql',
        graphqlHTTP({
          schema: new GraphQLSchema({
            query: new GraphQLObjectType({
              name: 'Query',
              description: 'The root of all queries',
              fields: () => ({
                ...queries,
              }),
            }),
          }),
          graphiql: config.environment !== 'production',
          context: {
            registry: cradle,
          },
        })
      );
    });
  }, 'prepend');

  register({
    addToSchema: asValue(addToSchema),
  });
});

type GraphQLRegistry = {
  addToSchema: AddToSchema;
};

type GraphQLContext = {
  registry: Registry;
};

export { graphql };
export type { GraphQLRegistry, GraphQLContext };