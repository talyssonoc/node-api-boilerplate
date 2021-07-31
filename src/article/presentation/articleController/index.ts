import { Router } from "express";
import { makeCreateArticleHandler } from "./CreateArticleHandler";
import { makeFindArticlesHandler } from "./FindArticlesHandler";
import { makePublishArticleHandler } from "./PublishArticleHandler";

type Dependencies = {
  apiRouter: Router;
};

const makeArticleController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  router.get("/articles", makeFindArticlesHandler);
  router.post("/articles", makeCreateArticleHandler);
  router.patch("/articles/:articleId/publish", makePublishArticleHandler);

  apiRouter.use(router);
};

export { makeArticleController };
