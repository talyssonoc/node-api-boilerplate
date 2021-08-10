import { PublishArticle } from "@/article/application/PublishArticle";
import { controller } from "@/_lib/wrappers/controller";
import { Request, Response } from "express";

type Dependencies = {
  publishArticle: PublishArticle;
};

const publishArticleHandler = controller(
  ({ publishArticle }: Dependencies) =>
    async (req: Request, res: Response) => {
      const { articleId } = req.params;

      await publishArticle(articleId);

      res.sendStatus(204);
    }
);

export { publishArticleHandler };
