import { Comment } from '@/comment/domain/Comment';
import { CommentId } from '@/comment/domain/CommentId';
import { Repository } from '@/_lib/DDD';

type CommentRepository = Repository<Comment.Type> & {
  findById(id: CommentId['value']): Promise<Comment.Type>;
};

export { CommentRepository };
