import { Collection, Db } from 'mongodb';
import { MUUID } from 'uuid-mongodb';

type UserSchema = {
  _id: MUUID;
  username: string;
  password: string;
  roles: string[];
  status: 'ACTIVE' | 'DELETED';
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

type UserCollection = Collection<UserSchema>;

const initUserCollection = async (db: Db): Promise<UserCollection> => {
  const collection: UserCollection = db.collection('user');

  await collection.createIndex({ username: 1, deleted: -1 }, { unique: true });

  return collection;
};

export { initUserCollection };
export type { UserSchema, UserCollection };
