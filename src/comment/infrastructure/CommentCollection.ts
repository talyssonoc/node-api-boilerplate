import { Collection, Db } from 'mongodb';
import { MUUID } from 'uuid-mongodb';

type CommentSchema = {
  _id: MUUID;
  body: string;
  articleId: MUUID;
  status: 'ACTIVE' | 'DELETED';
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

type CommentCollection = Collection<CommentSchema>;

const initCommentCollection = async (db: Db): Promise<CommentCollection> => {
  const collection: CommentCollection = db.collection('comment');

  await collection.createIndex({ _id: 1, version: 1 });
  await collection.createIndex({ _id: 1, deleted: 1 });

  return collection;
};

export { initCommentCollection };
export type { CommentSchema, CommentCollection };
