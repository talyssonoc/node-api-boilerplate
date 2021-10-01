import { IncomingMessage, ServerResponse } from 'http';

type NextFunction = (err?: any) => void;

type RequestHandler = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void;

export { RequestHandler };
