import { CreateArticle } from "@/article/application/useCases/CreateArticle";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { controller } from "@/_lib/http/controller";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
  createArticle: CreateArticle;
};

const { getBody } = makeValidator({
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }).required(),
});

const createArticleHandler = controller(({ createArticle }: Dependencies) => async (req: Request, res: Response) => {
  const { title, content } = await getBody(req);

  const articleId = await createArticle({ title, content });

  res.json({ id: articleId });
});

export { createArticleHandler };
