import { makeModule } from '@/context';
import { resolve } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import fastifySwagger from 'fastify-swagger';

type SwaggerConfig = {
  swagger: {
    title: string;
    version: string;
    basePath: string;
    docEndpoint: string;
  };
};

const swagger = makeModule('swagger', async ({ container: { build }, config: { http, swagger } }) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: swagger.title,
        version: swagger.version,
      },
      host: `${http.host}:${http.port}`,
      basePath: swagger.basePath,
    },
    apis: [resolve(__dirname, '../**/interface/http/**/*.yaml'), resolve(__dirname, '../**/interface/http/**/*.ts')],
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);

  build(({ server }) => {
    server.register(fastifySwagger, {
      routePrefix: swagger.docEndpoint,
      swagger: swaggerSpec,
      exposeRoute: true,
    });
  });
});

export { swagger };
export type { SwaggerConfig };
