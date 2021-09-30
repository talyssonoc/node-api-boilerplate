import { CreateArticle } from '@/article/application/useCases/CreateArticle';
import { makeValidator } from '@/_lib/http/validation/Validator';
import { handler } from '@/_lib/http/handler';
import { Request, Response } from 'express';
import Joi from 'types-joi';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
  createArticle: CreateArticle;
};

const { getBody } = makeValidator({
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }).required(),
});

const createArticleHandler = handler(({ createArticle }: Dependencies) => async (req: Request, res: Response) => {
  const { title, content } = getBody(req);

  const articleId = await createArticle({ title, content });

  res.status(HttpStatus.CREATED).json({ id: articleId });
});

export { createArticleHandler };
