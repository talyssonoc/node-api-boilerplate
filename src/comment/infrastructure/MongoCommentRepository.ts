import { Comment } from '@/comment/domain/Comment';
import { CommentId } from '@/comment/domain/CommentId';
import { CommentRepository } from '@/comment/domain/CommentRepository';
import { CommentCollection } from '@/comment/infrastructure/CommentCollection';
import { CommentIdProvider } from '@/comment/infrastructure/CommentIdProvider';
import { CommentMapper } from '@/comment/infrastructure/CommentMapper';
import { ArticleIdProvider } from '@/_sharedKernel/infrastructure/ArticleIdProvider';
import { from, v4 } from 'uuid-mongodb';

type Dependencies = {
  commentCollection: CommentCollection;
};

const makeMongoCommentRepository = ({ commentCollection }: Dependencies): CommentRepository => ({
  async getNextId(): Promise<CommentId> {
    return Promise.resolve(CommentIdProvider.create(v4().toString()));
  },
  async findById(id: string): Promise<Comment.Type> {
    const comment = await commentCollection.findOne({ _id: from(id), deleted: false });

    if (!comment) {
      throw new Error('Comment not found');
    }

    return CommentMapper.toEntity(comment);
  },
  async store(entity: Comment.Type): Promise<void> {
    CommentIdProvider.validate(entity.id);
    ArticleIdProvider.validate(entity.articleId);

    const { _id, version, ...data } = CommentMapper.toData(entity);

    const count = await commentCollection.countDocuments({ _id });

    if (count) {
      await commentCollection.updateOne(
        { _id, version, deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
            version: version + 1,
          },
        }
      );

      return;
    }

    await commentCollection.insertOne({
      _id,
      ...data,
      version,
    });
  },
});

export { makeMongoCommentRepository };
