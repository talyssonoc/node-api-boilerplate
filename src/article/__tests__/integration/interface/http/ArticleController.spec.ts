import { randomBytes } from 'crypto';
import { makeTestControls, TestControls } from '@/__tests__/TestControls';

describe('ArticleController', () => {
  let controls: TestControls;

  beforeAll(async () => {
    controls = await makeTestControls();
  });

  beforeEach(async () => {
    const { clearDatabase } = controls;

    await clearDatabase();
  });

  afterAll(async () => {
    const { cleanUp } = controls;

    await cleanUp();
  });

  describe('POST /api/articles', () => {
    it('should create a new Article', async () => {
      const {
        request,
        registry: { articleRepository },
      } = controls;

      const title = randomBytes(20).toString('hex');
      const content = 'New Article content';

      return request()
        .post('/api/articles')
        .send({
          title,
          content,
        })
        .expect(async (res) => {
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty('id');

          const article = await articleRepository.findById(res.body.id);

          expect(article).toEqual(
            expect.objectContaining({
              title,
              content,
            })
          );
        });
    });

    it('should fail with 422 when no title is present', async () => {
      const { request } = controls;

      return request()
        .post('/api/articles')
        .send({
          content: 'New Article content',
        })
        .expect((res) => {
          expect(res.status).toBe(422);
        });
    });

    it('should fail with 422 when no content is present', async () => {
      const { request } = controls;

      return request()
        .post('/api/articles')
        .send({
          title: randomBytes(20).toString('hex'),
        })
        .expect((res) => {
          expect(res.status).toBe(422);
        });
    });
  });
});
