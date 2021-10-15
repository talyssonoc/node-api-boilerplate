import { FastifyInstance } from 'fastify';

type ApiRouterFn = (fastify: FastifyInstance) => void;
type ApiRouter = (fn: ApiRouterFn) => void;

export { ApiRouter };
