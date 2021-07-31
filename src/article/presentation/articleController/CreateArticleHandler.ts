import { CreateArticle } from "@/article/application/CreateArticle";
import { makeValidator } from "@/_lib/validation/Validator";
import { controller } from "@/_lib/wrappers/controller";
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

const makeCreateArticleHandler = controller(
  ({ createArticle }: Dependencies) =>
    async (req: Request, res: Response) => {
      const { title, content } = getBody(req);

      const articleId = await createArticle({ title, content });

      res.json({ id: articleId });
    }
);

export { makeCreateArticleHandler };
