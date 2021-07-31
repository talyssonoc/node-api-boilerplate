import { CreateComment } from "@/comment/application/CreateComment";
import { controller } from "@/_lib/wrappers/controller";

type Dependencies = {
  createComment: CreateComment;
};

const createCommentHandler = controller(({ createComment }: Dependencies) => async (req, res) => {
  const id = await createComment({ body: req.body.body });

  res.json({ id });
});

export { createCommentHandler };
