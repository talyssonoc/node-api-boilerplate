import { CreateArticle } from '@/article/application/useCases/CreateArticle';
import { makeValidator } from '@/_lib/http/validation/Validator';
import { handler } from '@/_lib/http/handler';
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

const createArticleHandler = handler(({ createArticle }: Dependencies) => async (request, reply) => {
  const { title, content } = getBody(request);
  const articleId = await createArticle({ title, content });

  reply.status(HttpStatus.CREATED).send({ id: articleId });
});

export { createArticleHandler };
