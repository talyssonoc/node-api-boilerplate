import { PublishArticle } from '@/article/application/useCases/PublishArticle';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
  publishArticle: PublishArticle;
};

const { getParams } = makeValidator({
  params: Joi.object({
    articleId: Joi.string().required(),
  }).required(),
});

const publishArticleHandler = handler(({ publishArticle }: Dependencies) => async (request, reply) => {
  const { articleId } = getParams(request);

  await publishArticle(articleId);

  reply.status(HttpStatus.NO_CONTENT);
});

export { publishArticleHandler };
