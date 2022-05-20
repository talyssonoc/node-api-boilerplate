import { createCommentHandler } from '@/comment/interface/http/commentController/CreateCommentHandler';
import { ApiRouter } from '@/_lib/http/apiRouter';

type Dependencies = {
  apiRouter: ApiRouter;
};

const makeCommentController = ({ apiRouter }: Dependencies): void => {
  apiRouter((router) => {
    router.post('/articles/:articleId/comments', createCommentHandler);
  });
};

export { makeCommentController };
