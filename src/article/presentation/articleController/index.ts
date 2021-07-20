import { makeCreateArticleHandler } from './CreateArticleHandler';
import { Router } from 'express';
import { Injector } from '../../../lib/Injector';

const makeArticleController = ({inject}: Injector) => {
  const router = Router();

  router.post('/', inject(makeCreateArticleHandler));

  return router;
}

export { makeArticleController }