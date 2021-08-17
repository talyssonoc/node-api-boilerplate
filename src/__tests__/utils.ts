import { container } from "@/container";
import { withContext } from "@/context";
import { main } from "@/_boot";
import { Db } from "mongodb";
import supertest from "supertest";

type Dependencies = {
  mongo: Db;
};

const makeClearDatabase =
  ({ mongo }: Dependencies) =>
  async (): Promise<void> => {
    console.log("clearing collections");
    const collections = await mongo.collections();

    await Promise.all(collections.map((collection) => collection.deleteMany({})));
  };

const setup = async () => {
  await main();

  const { server } = container.cradle;

  return {
    request: () => supertest(server),
    clearDatabase: container.build(makeClearDatabase),
    container,
  };
};

const cleanUp = (): (() => Promise<void>) =>
  withContext(async ({ teardown }) => {
    await teardown();
  });

export { makeClearDatabase, setup, cleanUp };
