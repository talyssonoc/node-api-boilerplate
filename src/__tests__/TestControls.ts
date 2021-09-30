import { Container, container } from '@/container';
import { withContext } from '@/context';
import { main } from '@/_boot';
import { Db } from 'mongodb';
import supertest, { SuperTest, Test } from 'supertest';

type Dependencies = {
  mongo: Db;
};

type TestControls = Readonly<{
  request: () => SuperTest<Test>;
  clearDatabase: () => Promise<void>;
  cleanUp: () => Promise<void>;
  container: Container;
  registry: Container['cradle'];
}>;

const appRunning = withContext(
  ({ app: { onRunning } }) =>
    new Promise<void>((resolve) => {
      onRunning(async () => {
        resolve();
      });

      main();
    })
);

const makeClearDatabase =
  ({ mongo }: Dependencies) =>
  async (): Promise<void> => {
    const collections = await mongo.collections();

    await Promise.all(collections.map((collection) => collection.deleteMany({})));
  };

const makeTestControls = async (): Promise<TestControls> => {
  await appRunning();

  const { server } = container.cradle;

  const clearDatabase = container.build(makeClearDatabase);

  const cleanUp = withContext(async ({ app }) => {
    await clearDatabase();
    await app.stop();
  });

  return {
    request: () => supertest(server),
    registry: container.cradle,
    clearDatabase,
    container,
    cleanUp,
  };
};

export { makeTestControls };
export type { TestControls };
