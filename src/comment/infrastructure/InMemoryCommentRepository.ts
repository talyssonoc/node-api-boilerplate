import MUUID from "uuid-mongodb";
import { MemoryDB } from "@/_sharedKernel/infrastructure/MemoryDB";
import { Comment } from "@/comment/domain/Comment";
import { CommentRepository } from "@/comment/domain/CommentRepository";

type Dependencies = {
  memoryDB: MemoryDB;
};

const makeInMemoryCommentRepository = ({ memoryDB }: Dependencies): CommentRepository => ({
  async getNextId(): Promise<string> {
    return Promise.resolve(MUUID.v4().toString());
  },
  async store(comment: Comment.Type) {
    memoryDB.comments[comment.id] = {
      ...comment,
    };

    return Promise.resolve();
  },
});

export { makeInMemoryCommentRepository };
