import { Collection } from 'mongodb';
import { ObjectId } from 'mongodb';

type ArticleSchema = {
  _id: string | ObjectId;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DELETED';
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

type ArticleCollection = Collection<ArticleSchema>;

export {
  ArticleSchema,
  ArticleCollection
}