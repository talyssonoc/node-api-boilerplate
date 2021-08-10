import { FindArticles } from "@/article/query/FindArticles";
import { controller } from "@/_lib/wrappers/controller";
import { Request, Response } from "express";

type Dependencies = {
  findArticles: FindArticles;
};

const findArticlesHandler = controller(({ findArticles }: Dependencies) => async (req: Request, res: Response) => {
  const articles = await findArticles();

  res.json(articles);
});

export { findArticlesHandler };
