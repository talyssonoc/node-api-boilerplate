import { Comment } from '@/comment/domain/Comment';
import { CommentSchema } from '@/comment/infrastructure/CommentCollection';
import { CommentIdProvider } from '@/comment/infrastructure/CommentIdProvider';
import { DataMapper } from '@/_lib/DDD';
import { ArticleIdProvider } from '@/_sharedKernel/infrastructure/ArticleIdProvider';
import { from } from 'uuid-mongodb';

const CommentMapper: DataMapper<Comment.Type, CommentSchema> = {
  toData: (entity) => ({
    _id: from(entity.id.value),
    body: entity.body,
    articleId: from(entity.articleId.value),
    status: entity.status,
    deleted: entity.status === 'DELETED',
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    version: entity.version,
  }),
  toEntity: (data) => ({
    id: CommentIdProvider.create(from(data._id).toString()),
    body: data.body,
    articleId: ArticleIdProvider.create(from(data.articleId).toString()),
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
    version: data.version,
  }),
};

export { CommentMapper };
