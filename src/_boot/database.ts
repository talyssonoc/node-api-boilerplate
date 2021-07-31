import { InitFunction } from "@/_lib/AppInitializer";
import { makeMemoryDB, MemoryDB } from "@/_sharedKernel/infrastructure/MemoryDB";
import { asFunction } from "awilix";

const database: InitFunction = async ({ register }) => {
  register({
    memoryDB: asFunction(makeMemoryDB).singleton(),
  });
};

type Container = {
  memoryDB: MemoryDB;
};

export { database, Container };
