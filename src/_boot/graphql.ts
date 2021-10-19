import { asValue } from 'awilix';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import { makeSchemaStorage, RegisterSchema } from '@/_lib/graphql/schema';
import { makeModule } from '@/context';
import { config } from '@/config';

const graphql = makeModule('graphql', async ({ app: { onBooted }, container: { build, register, cradle } }) => {
  const { getSchemaData, registerSchema } = build(makeSchemaStorage);

  onBooted(async () => {
    const { queries } = getSchemaData();

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
    registerSchema: asValue(registerSchema),
  });
});

type GraphQLRegistry = {
  registerSchema: RegisterSchema;
};

export { graphql };
export type { GraphQLRegistry };
