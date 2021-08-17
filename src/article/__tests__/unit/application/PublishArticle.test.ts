import { makePublishArticle, PublishArticle } from "@/article/application/useCases/PublishArticle";
import { Article } from "@/article/domain/Article";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { NotFoundException } from "@/_lib/exceptions/NotFoundException";

describe("DeleteArticle", () => {
  const id = "mock-article-id";
  const title = "Title";
  const content = "Some content";

  const articleRepository: ArticleRepository = {
    findById: jest.fn().mockImplementation(async (articleId) => {
      if (articleId !== id) {
        throw new NotFoundException();
      }

      return Article.create({
        id: { value: id },
        title,
        content,
      });
    }),
    store: jest.fn(),
    getNextId: jest.fn(),
  };

  let publishArticle: PublishArticle;

  beforeEach(async () => {
    jest.clearAllMocks();
    publishArticle = makePublishArticle({ articleRepository });
  });

  it("should save the article as published", async () => {
    await publishArticle(id);

    expect(articleRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({
        id: { value: id },
        state: "PUBLISHED",
      })
    );
  });

  it("should throw error if not found", async () => {
    await expect(publishArticle("some-wrong-id")).rejects.toThrowError(NotFoundException);
  });
});
