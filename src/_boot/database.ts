import { InitFunction } from "@/_lib/AppInitializer";
import { makeMongoProvider, MongoProvider } from "@/_lib/MongoProvider";
import { makeMemoryDB, MemoryDB } from "@/_sharedKernel/infrastructure/MemoryDB";
import { asFunction, asValue } from "awilix";
import { Db, MongoClient } from "mongodb";

type Configuration = {
  mongodb: {
    database: string;
    host: string;
    username: string;
    password: string;
  };
};

const database: InitFunction = async ({ register }, { mongodb }) => {
  const client = new MongoClient(mongodb.host, {
    auth: { username: mongodb.username, password: mongodb.password },
  });

  await client.connect();

  const db = client.db(mongodb.database);

  process.on("SIGTERM", async () => {
    await client.close();
    process.exit(0);
  });

  const mongoProvider = makeMongoProvider({ db });

  register({
    memoryDB: asFunction(makeMemoryDB).singleton(),
    mongo: asValue(db),
    mongoProvider: asValue(mongoProvider),
  });
};

type Container = {
  memoryDB: MemoryDB;
  mongo: Db;
  mongoProvider: MongoProvider;
};

export { database, Container, Configuration };
