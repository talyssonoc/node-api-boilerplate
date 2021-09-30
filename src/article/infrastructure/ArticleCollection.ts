import { Collection, Db } from 'mongodb';
import { MUUID } from 'uuid-mongodb';

type ArticleSchema = {
  _id: MUUID;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DELETED';
  publishedAt: Date | null;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

type ArticleCollection = Collection<ArticleSchema>;

const initArticleCollection = async (db: Db): Promise<ArticleCollection> => {
  const collection: ArticleCollection = db.collection('article');

  await collection.createIndex({ title: 1 }, { unique: true });
  await collection.createIndex({ _id: 1, version: 1 });
  await collection.createIndex({ _id: 1, deleted: 1 });

  return collection;
};

export { initArticleCollection };
export type { ArticleSchema, ArticleCollection };
