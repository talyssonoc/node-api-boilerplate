import { v4 } from 'uuid';
import { RequestHandler } from 'express';

const requestId =
  (idProvider: () => string = v4): RequestHandler =>
  (req, res, next) => {
    req.id = idProvider();

    next();
  };

export { requestId };
