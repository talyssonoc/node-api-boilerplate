import { Comment } from "@/comment/domain/Comment";
import { CommentRepository } from "@/comment/domain/CommentRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  commentRepository: CommentRepository;
};

type CreateCommentDTO = Readonly<{
  body: string;
}>;

type CreateComment = ApplicationService<CreateCommentDTO, string>;

const makeCreateComment =
  ({ commentRepository }: Dependencies): CreateComment =>
  async payload => {
    const id = await commentRepository.getNextId();

    const comment = Comment.create({
      id,
      body: payload.body,
    });

    await commentRepository.store(comment);

    return id;
  };

export { makeCreateComment, CreateComment };
