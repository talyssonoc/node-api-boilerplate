import { asValue, AwilixContainer } from 'awilix';
import { RequestHandler } from '@/_lib/http/RequestHandler';

const requestContainer =
  <T extends AwilixContainer>(container: T): RequestHandler =>
  (req, res, next) => {
    const scopedContainer = container.createScope();

    scopedContainer.register({
      requestId: asValue(req.id),
    });

    req.container = scopedContainer;
    next();
  };

export { requestContainer };
