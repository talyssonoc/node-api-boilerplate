import { Collection, Db } from 'mongodb';
import MUUID from 'uuid-mongodb';

MUUID.mode('relaxed');

interface Dependencies {
  db: Db;
}

type CollectionInitializer = Record<string, (db: Db) => Promise<Collection<any>>>;

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type MongoProvider = <Type extends CollectionInitializer>(
  collectionInitializer: Type
) => Promise<{ [key in keyof Type]: ThenArg<ReturnType<Type[key]>> }>;

type InitializedCollections<Type extends CollectionInitializer> = Promise<
  { [key in keyof Type]: ThenArg<ReturnType<Type[key]>> }
>;

const makeMongoProvider =
  ({ db }: Dependencies): MongoProvider =>
  (collections) =>
    Object.entries(collections).reduce(
      (chain: Promise<any>, [key, promise]) =>
        chain.then((acc) => promise(db).then((collection) => ({ ...acc, [key]: collection }))),
      Promise.resolve()
    );

const withMongoProvider =
  <Type extends CollectionInitializer>(collections: Type) =>
  ({ mongoProvider }: { mongoProvider: MongoProvider }): InitializedCollections<Type> =>
    mongoProvider(collections);

export { makeMongoProvider, withMongoProvider };
export type { MongoProvider };
