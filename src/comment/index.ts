import { CreateComment, makeCreateComment } from '@/comment/application/useCases/CreateComment';
import { CommentRepository } from '@/comment/domain/CommentRepository';
import { CommentCollection, initCommentCollection } from '@/comment/infrastructure/CommentCollection';
import { makeMongoCommentRepository } from '@/comment/infrastructure/MongoCommentRepository';
import { makeCommentController } from '@/comment/interface/http/commentController';
import { makeModule } from '@/context';
import { withMongoProvider } from '@/_lib/MongoProvider';
import { toContainerValues } from '@/_lib/di/containerAdapters';
import { asFunction } from 'awilix';

const commentModule = makeModule('comment', async ({ container: { register, build } }) => {
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

type CommentRegistry = {
  commentCollection: CommentCollection;
  commentRepository: CommentRepository;
  createComment: CreateComment;
};

export { commentModule };
export type { CommentRegistry };
