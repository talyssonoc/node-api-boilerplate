import { asValue } from 'awilix';
import { RequestHandler } from 'express';
import { Container } from '@/container';

const requestContainer =
  (container: Container): RequestHandler =>
  (req, _, next) => {
    const scopedContainer = container.createScope();

    scopedContainer.register({
      requestId: asValue(req.id),
    });

    req.container = scopedContainer;
    next();
  };

export { requestContainer };
