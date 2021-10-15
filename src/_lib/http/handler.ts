import { asFunction } from 'awilix';
import { FastifyRequest, FastifyReply } from 'fastify';

type FastifyHandler = (request: FastifyRequest, reply: FastifyReply) => any;

type ControllerHandler = (dependencies: any) => FastifyHandler;

const handler = (handler: ControllerHandler): FastifyHandler => {
  const resolver = asFunction(handler);

  return (request, reply) => {
    if (!('container' in request.raw)) {
      throw new Error("Can't find the request container! Have you registered the `requestContainer` middleware?");
    }

    const injectedHandler = request.raw.container.build(resolver);

    return injectedHandler(request, reply);
  };
};

export { handler };
