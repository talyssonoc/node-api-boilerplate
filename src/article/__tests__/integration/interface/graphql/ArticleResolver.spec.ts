import { randomBytes } from 'crypto';
import { makeTestControls, TestControls } from '@/__tests__/TestControls';

describe('ArticleResolver', () => {
  let controls: TestControls;

  beforeAll(async () => {
    controls = await makeTestControls();
  });

  // beforeEach(async () => {
  //   const { clearDatabase } = controls;

  //   await clearDatabase();
  // });

  // afterAll(async () => {
  //   const { cleanUp } = controls;

  //   await cleanUp();
  // });

  describe('QUERY Articles', () => {
    it('gets the first page of articles', async () => {
      const { request } = controls;

      const title = randomBytes(20).toString('hex');
      const content = 'New Article content';
      const getArticlesQuery = `
          query Articles($filter: ArticleFilter, $sort: [Sort], $pagination: Pagination) {
            articles(filter: $filter, sort: $sort, pagination: $pagination) {
              id
              title
              comments {
                id
                body
                createdAt
              }
            }
          }
        `;
      const variables = {
        pagination: {
          page: 1,
          pageSize: 10,
        },
      };

      const response = await request().post('/api/articles').send({
        title,
        content,
      });

      await request().patch(`/api/articles/${response.body.id}/publish`);

      return request()
        .post('/graphql')
        .send({
          operationName: 'Articles',
          query: getArticlesQuery,
          variables,
        })
        .expect(async (res) => {
          console.log(res);
          expect(res.status).toBe(200);
          const { data } = res.body;
          expect(data).toHaveProperty('articles');
          expect(data.articles).toHaveLength(1);
        });
    });
  });
});
