import { initFunction } from "@/_lib/AppInitializer";
import { makeMongoProvider, MongoProvider } from "@/_lib/MongoProvider";
import { asValue } from "awilix";
import { Db, MongoClient } from "mongodb";

type DatabaseConfig = {
  mongodb: {
    database: string;
    host: string;
    username: string;
    password: string;
  };
};

const database = initFunction(async ({ register }, { mongodb }) => {
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
    mongo: asValue(db),
    mongoProvider: asValue(mongoProvider),
  });
});

type DatabaseRegistry = {
  mongo: Db;
  mongoProvider: MongoProvider;
};

export { database, DatabaseRegistry, DatabaseConfig };
