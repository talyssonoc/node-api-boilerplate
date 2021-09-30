import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const runAsync = (handler: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
  handler(req, res, next).catch(next);

export { runAsync };
export type { AsyncHandler };
