import { deleteArticleHandler } from '@/article/interface/http/articleController/DeleteArticleHandler';
import { ApiRouter } from '@/_lib/http/apiRouter';
import { createArticleHandler } from './CreateArticleHandler';
import { findArticlesHandler } from './FindArticlesHandler';
import { publishArticleHandler } from './PublishArticleHandler';

type Dependencies = {
  apiRouter: ApiRouter;
};

const makeArticleController = ({ apiRouter }: Dependencies): void => {
  apiRouter((fastify) => {
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
    fastify.get('/articles', findArticlesHandler);
    fastify.post('/articles', createArticleHandler);
    fastify.delete('/articles/:articleId', deleteArticleHandler);
    fastify.patch('/articles/:articleId/publish', publishArticleHandler);
  });
};

export { makeArticleController };
