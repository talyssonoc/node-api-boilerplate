import { CreateComment, makeCreateComment } from "@/comment/application/CreateComment";
import { CommentRepository } from "@/comment/domain/CommentRepository";
import { CommentCollection, initCommentCollection } from "@/comment/infrastructure/CommentCollection";
import { makeMongoCommentRepository } from "@/comment/infrastructure/MongoCommentRepository";
import { makeCommentController } from "@/comment/presentation/commentController";
import { initFunction } from "@/_lib/AppInitializer";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/wrappers/toContainerFunctions";
import { asFunction } from "awilix";

const commentModule = initFunction(async ({ register, build }) => {
  const collections = await build(
    withMongoProvider({
      commentCollection: initCommentCollection,
    })
  );

  register({
    ...toContainerValues(collections),
    commentRepository: asFunction(makeMongoCommentRepository),
    createComment: asFunction(makeCreateComment),
  });

  build(makeCommentController);
});

type Container = {
  commentCollection: CommentCollection;
  commentRepository: CommentRepository;
  createComment: CreateComment;
};

export { commentModule, Container };
