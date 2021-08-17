import { container } from "@/container";
import { withContext } from "@/context";
import { main } from "@/_boot";
import { randomBytes } from "crypto";
import { Application } from "express";
import supertest from "supertest";

describe("ArticleController", () => {
  let app: Application;

  beforeAll(async () => {
    await main();

    const { server } = container.cradle;

    app = server;
  });

  afterAll(
    withContext(async ({ teardown }) => {
      await teardown();
    })
  );

  describe("POST /api/articles", () => {
    it("should create a new Article", async () => {
      const title = randomBytes(20).toString("hex");
      const content = "New Article content";

      return supertest(app)
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
      return supertest(app)
        .post("/api/articles")
        .send({
          content: "New Article content",
        })
        .expect((res) => {
          expect(res.status).toBe(422);
        });
    });

    it("should fail with 422 when no content is present", async () => {
      return supertest(app)
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
