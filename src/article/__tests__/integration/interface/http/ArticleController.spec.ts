import { randomBytes } from "crypto";
import { SuperTest, Test } from "supertest";
import { cleanUp, setup } from "@/__tests__/utils";
import { Container } from "@/container";

describe("ArticleController", () => {
  let request: () => SuperTest<Test>;
  let clearDatabase: () => Promise<void>;
  let container: Container;

  beforeAll(async () => {
    const utils = await setup();
    request = utils.request;
    clearDatabase = utils.clearDatabase;
    container = utils.container;
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(cleanUp());

  describe("POST /api/articles", () => {
    it("should create a new Article", async () => {
      const title = randomBytes(20).toString("hex");
      const content = "New Article content";

      return request()
        .post("/api/articles")
        .send({
          title,
          content,
        })
        .expect(async (res) => {
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty("id");

          const { articleRepository } = container.cradle;

          const article = await articleRepository.findById(res.body.id);

          expect(article).toEqual(
            expect.objectContaining({
              title,
              content,
            })
          );
        });
    });

    it("should fail with 422 when no title is present", async () => {
      return request()
        .post("/api/articles")
        .send({
          content: "New Article content",
        })
        .expect((res) => {
          expect(res.status).toBe(422);
        });
    });

    it("should fail with 422 when no content is present", async () => {
      return request()
        .post("/api/articles")
        .send({
          title: randomBytes(20).toString("hex"),
        })
        .expect((res) => {
          expect(res.status).toBe(422);
        });
    });
  });
});
