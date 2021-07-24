import { Router } from "express";
import { Injector } from "@/lib/di/Injector";
import { makeCreateArticleHandler } from "./CreateArticleHandler";
import { makeFindArticlesHandler } from "./FindArticlesHandler";
import { makePublishArticleHandler } from "./PublishArticleHandler";

const makeArticleController = ({ inject }: Injector) => {
  const router = Router();

  router.get("/articles", inject(makeFindArticlesHandler));
  router.post("/articles", inject(makeCreateArticleHandler));
  router.patch("/articles/:articleId/publish", inject(makePublishArticleHandler));

  return router;
};

export { makeArticleController };
