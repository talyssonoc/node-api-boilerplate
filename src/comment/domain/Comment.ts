import { CommentId } from '@/comment/domain/CommentId';
import { AggregateRoot } from '@/_lib/DDD';
import { ArticleId } from '@/_sharedKernel/domain/ArticleId';

namespace Comment {
  type Status = 'ACTIVE' | 'DELETED';

  type Comment = AggregateRoot<CommentId> &
    Readonly<{
      body: string;
      articleId: ArticleId;
      status: Status;
      createdAt: Date;
      updatedAt: Date;
      version: number;
    }>;

  type CommentProps = Readonly<{
    id: CommentId;
    body: string;
    articleId: ArticleId;
  }>;

  export const create = (props: CommentProps): Comment => ({
    ...props,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
  });

  export const markAsDeleted = (self: Comment): Comment => ({
    ...self,
    status: 'DELETED',
  });

  export type Type = Comment;
}

export { Comment };
