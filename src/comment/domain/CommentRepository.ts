import { Comment } from "@/comment/domain/Comment";

type CommentRepository = {
  getNextId(): Promise<string>;
  store(comment: Comment.Type): Promise<void>;
};

export { CommentRepository };
