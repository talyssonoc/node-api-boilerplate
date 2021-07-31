import * as uuid from 'uuid';
import { RequestHandler } from 'express';

const requestId =
  (idProvider: () => string = uuid.v4): RequestHandler =>
  (req, res, next) => {
    req.id = idProvider();

    next();
  };

export { requestId };
