import { CreateComment, makeCreateComment } from "@/comment/application/CreateComment";
import { CommentRepository } from "@/comment/domain/CommentRepository";
import { makeInMemoryCommentRepository } from "@/comment/infrastructure/InMemoryCommentRepository";
import { makeCommentController } from "@/comment/presentation/commentController";
import { InitFunction } from "@/_lib/AppInitializer";
import { asFunction } from "awilix";

const commentModule: InitFunction = async ({ register, build }) => {
  register({
    commentRepository: asFunction(makeInMemoryCommentRepository),
    createComment: asFunction(makeCreateComment),
  });

  build(makeCommentController);
};

type Container = {
  commentRepository: CommentRepository;
  createComment: CreateComment;
};

export { commentModule, Container };
