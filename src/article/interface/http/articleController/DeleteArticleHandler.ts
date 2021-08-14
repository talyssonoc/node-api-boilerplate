import { DeleteArticle } from "@/article/application/useCases/DeleteArticle";
import { controller } from "@/_lib/http/controller";

type Dependencies = {
  deleteArticle: DeleteArticle;
};

const deleteArticleHandler = controller(({ deleteArticle }: Dependencies) => async (req, res) => {
  const { articleId } = req.params;

  await deleteArticle(articleId);

  res.sendStatus(204);
});

export { deleteArticleHandler };
