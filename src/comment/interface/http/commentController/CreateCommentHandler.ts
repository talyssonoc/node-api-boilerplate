import { CreateComment } from "@/comment/application/useCases/CreateComment";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { controller } from "@/_lib/http/controller";
import Joi from "types-joi";

type Dependencies = {
  createComment: CreateComment;
};

const { getBody, getParams } = makeValidator({
  params: Joi.object({
    articleId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    body: Joi.string().required(),
  }).required(),
});

const createCommentHandler = controller(({ createComment }: Dependencies) => async (req, res) => {
  const { body } = getBody(req);
  const { articleId } = getParams(req);

  const id = await createComment({ body, articleId });

  res.json({ id });
});

export { createCommentHandler };
