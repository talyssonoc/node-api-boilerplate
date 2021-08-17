import { ArticleCollection, ArticleSchema } from "@/article/infrastructure/ArticleCollection";
import MUUID from "uuid-mongodb";
import { FindArticles } from "@/article/query/FindArticles";
import { CommentSchema } from "@/comment/infrastructure/CommentCollection";

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeMongoFindArticles =
  ({ articleCollection }: Dependencies): FindArticles =>
  async () => {

    const articles = await articleCollection
      .aggregate([
        {
          $match: {
            status: "PUBLISHED",
            deleted: false,
          },
        },
        {
          $lookup: {
            from: "comment",
            as: "comments",
            let: { articleId: "$_id" },
            pipeline: [
              {
                $match: {
                  deleted: false,
                  $expr: { $eq: ["$articleId", "$$articleId"] },
                },
              },
            ],
          },
        },
      ])
      .toArray<ArticleSchema & { comments: CommentSchema[]; publishedAt: Date }>();

    return {
      data: articles.map(article => ({
        id: MUUID.from(article._id).toString(),
        title: article.title,
        content: article.content,
        publishedAt: article.publishedAt,
        comments: article.comments.map(comment => ({
          id: MUUID.from(comment._id).toString(),
          body: comment.body,
          createdAt: comment.createdAt,
        })),
      })),
    };
  };

export { makeMongoFindArticles };
