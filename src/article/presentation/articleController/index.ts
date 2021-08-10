import { deleteArticleHandler } from '@/article/presentation/articleController/DeleteArticleHandler';
import { Router } from "express";
import { createArticleHandler } from "./CreateArticleHandler";
import { findArticlesHandler } from "./FindArticlesHandler";
import { publishArticleHandler } from "./PublishArticleHandler";

type Dependencies = {
  apiRouter: Router;
};

const makeArticleController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  router.get("/articles", findArticlesHandler);
  router.post("/articles", createArticleHandler);
  router.delete("/articles/:articleId", deleteArticleHandler);
  router.patch("/articles/:articleId/publish", publishArticleHandler);

  apiRouter.use(router);
};

export { makeArticleController };
