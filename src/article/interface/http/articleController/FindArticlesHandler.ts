import { FindArticles } from "@/article/query/FindArticles";
import { handler } from "@/_lib/http/handler";
import { Request, Response } from "express";
import Joi from "types-joi";
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
  findArticles: FindArticles;
};

const { getQuery } = makeValidator({
  query: Joi.object({
    filter: Joi.object({
      title: Joi.string(),
      publishedBetween: Joi.array().items(Joi.date().iso().required()).min(2).max(2),
    }),
  })
    .required()
    .options({ allowUnknown: true }),
});

const findArticlesHandler = handler(({ findArticles }: Dependencies) => async (req, res) => {
  const { filter } = await getQuery(req);

  const articles = await findArticles({
    filter: filter || {},
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });

  res.json(articles);
});

export { findArticlesHandler };
