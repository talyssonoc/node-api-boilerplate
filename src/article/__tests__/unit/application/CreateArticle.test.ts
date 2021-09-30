import { ArticleCreatedEvent } from '@/article/application/events/ArticleCreatedEvent';
import { CreateArticle, makeCreateArticle } from '@/article/application/useCases/CreateArticle';
import { ArticleRepository } from '@/article/domain/ArticleRepository';
import { Publisher } from '@/_lib/events/Publisher';

describe('CreateArticle', () => {
  const id = 'mock-article-id';
  const title = 'Title';
  const content = 'Some content';

  const articleRepository: ArticleRepository = {
    findById: jest.fn(),
    store: jest.fn(),
    getNextId: jest.fn().mockReturnValue(Promise.resolve({ value: id })),
  };

  const publisher: Publisher = {
    publish: jest.fn(),
  };

  let createArticle: CreateArticle;

  beforeEach(async () => {
    jest.clearAllMocks();
    createArticle = makeCreateArticle({ articleRepository, eventEmitterPubSub: publisher });
  });

  it('should return the created id', async () => {
    const result = await createArticle({ title, content });

    expect(result).toBe(id);
  });

  it('should store the article', async () => {
    await createArticle({ title, content });

    expect(articleRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({
        id: { value: id },
        title,
        content,
      })
    );
  });

  it('should enqueue ArticleCreatedEvent', async () => {
    await createArticle({ title, content });

    expect(publisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ArticleCreatedEvent.eventType,
        topic: ArticleCreatedEvent.topic,
        payload: expect.objectContaining({
          id: { value: id },
          title,
          content,
        }),
      })
    );
  });
});
