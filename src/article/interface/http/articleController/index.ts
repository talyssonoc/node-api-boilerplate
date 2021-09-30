import { deleteArticleHandler } from '@/article/interface/http/articleController/DeleteArticleHandler';
import { Router } from 'express';
import { createArticleHandler } from './CreateArticleHandler';
import { findArticlesHandler } from './FindArticlesHandler';
import { publishArticleHandler } from './PublishArticleHandler';

type Dependencies = {
  apiRouter: Router;
};

const makeArticleController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  /**
   * @swagger
   *
   * /articles:
   *   get:
   *     tags:
   *       - Articles
   *     summary: The list of published articles
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of published articles
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/ArticleDTO'
   */
  router.get('/articles', findArticlesHandler);
  router.post('/articles', createArticleHandler);
  router.delete('/articles/:articleId', deleteArticleHandler);
  router.patch('/articles/:articleId/publish', publishArticleHandler);

  apiRouter.use(router);
};

export { makeArticleController };
