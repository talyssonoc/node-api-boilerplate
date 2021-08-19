import { FindArticles } from "@/article/query/FindArticles";
import { handler } from "@/_lib/http/handler";
import { Request, Response } from "express";
import { makePageable } from "@/_lib/Pageable";

type Dependencies = {
  findArticles: FindArticles;
};

const pageable = makePageable();

const findArticlesHandler = handler(({ findArticles }: Dependencies) => async (req: Request, res: Response) => {
  const { filter, page, pageSize } = await pageable(req);

  const articles = await findArticles({
    filter,
    pagination: {
      page,
      pageSize,
    },
  });

  res.json(articles);
});

export { findArticlesHandler };
