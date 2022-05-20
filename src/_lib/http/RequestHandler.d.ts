import { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

type NextFunction = (err?: any) => void;

type RequestHandler = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void;

type ErrorHandler = (error: Error, request: FastifyRequest, reply: FastifyReply) => void | Promise<void>;

export { RequestHandler, ErrorHandler };
