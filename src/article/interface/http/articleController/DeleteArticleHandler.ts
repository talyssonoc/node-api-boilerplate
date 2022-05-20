import { makeValidator } from '@/_lib/http/validation/Validator';
import { DeleteArticle } from '@/article/application/useCases/DeleteArticle';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import Joi from 'types-joi';

type Dependencies = {
  deleteArticle: DeleteArticle;
};

const { getParams } = makeValidator({
  params: Joi.object({
    articleId: Joi.string().required(),
  }).required(),
});

const deleteArticleHandler = handler(({ deleteArticle }: Dependencies) => async (request, reply) => {
  const { articleId } = getParams(request);

  await deleteArticle(articleId);

  reply.status(HttpStatus.NO_CONTENT);
});

export { deleteArticleHandler };
