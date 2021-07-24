import { FindArticles } from "@/article/query/FindArticles";
import { Request, Response } from "express";

type Dependencies = {
  findArticles: FindArticles;
};

const makeFindArticlesHandler =
  ({ findArticles }: Dependencies) =>
  async (req: Request, res: Response) => {
    const articles = await findArticles();

    res.json(articles);
  };

export { makeFindArticlesHandler };
