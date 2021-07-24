import { PublishArticle } from "@/article/application/PublishArticle";
import { Request, Response } from "express";

type Dependencies = {
  publishArticle: PublishArticle;
};

const makePublishArticleHandler =
  ({ publishArticle }: Dependencies) =>
  async (req: Request, res: Response) => {
    const { articleId } = req.params;

    await publishArticle(articleId);

    res.sendStatus(204);
  };

export { makePublishArticleHandler };
