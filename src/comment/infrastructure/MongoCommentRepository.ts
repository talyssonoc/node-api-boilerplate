import { Comment } from "@/comment/domain/Comment";
import { CommentCollection } from "@/comment/infrastructure/CommentCollection";
import MUUID from "uuid-mongodb";

type Dependencies = {
  commentCollection: CommentCollection;
};

const makeMongoCommentRepository = ({ commentCollection }: Dependencies): ArticleRepository => ({
  async getNextId(): Promise<string> {
    return Promise.resolve(MUUID.v4().toString());
  },
  async findById(id: string): Promise<Comment.Type> {
    const comment = await commentCollection.findOne({ _id: MUUID.from(id), deleted: false });

    if (!comment) {
      throw new Error("Comment not found");
    }

    return {
      id: MUUID.from(comment._id).toString(),
      body: comment.body,
      articleId: MUUID.from(comment.articleId).toString(),
      status: comment.status,
      createdAt: comment.createdAt,
      updatedAt: comment.createdAt,
      version: comment.version,
    };
  },
  async store(entity: Comment.Type): Promise<void> {
    const count = await commentCollection.countDocuments({ _id: MUUID.from(entity.id), deleted: false });

    if (count) {
      await commentCollection.updateOne(
        { _id: MUUID.from(entity.id), version: entity.version },
        {
          $set: {
            body: entity.body,
            articleId: MUUID.from(entity.articleId),
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: new Date(),
            version: entity.version + 1,
          },
        }
      );

      return;
    }

    await commentCollection.insertOne({
      _id: MUUID.from(entity.id),
      body: entity.body,
      articleId: MUUID.from(entity.articleId),
      status: entity.status,
      deleted: entity.status === "DELETED",
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      version: entity.version,
    });
  },
});

export { makeMongoCommentRepository };
