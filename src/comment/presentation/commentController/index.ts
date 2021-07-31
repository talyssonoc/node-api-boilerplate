import { createCommentHandler } from "@/comment/presentation/commentController/CreateCommentHandler";
import { Router } from "express";

type Dependencies = {
  apiRouter: Router;
};

const makeCommentController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  router.post("/comments", createCommentHandler);

  apiRouter.use(router);
};

export { makeCommentController };
