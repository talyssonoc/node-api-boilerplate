import { CommentId } from '@/comment/domain/CommentId';
import { makeIdProvider } from '@/_lib/IdProvider';

const CommentIdProvider = makeIdProvider<CommentId>('CommentId');

export { CommentIdProvider };
