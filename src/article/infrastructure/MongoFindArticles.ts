import { ArticleCollection, ArticleSchema } from '@/article/infrastructure/ArticleCollection';
import MUUID from 'uuid-mongodb';
import { FindArticles } from '@/article/application/query/FindArticles';
import { CommentSchema } from '@/comment/infrastructure/CommentCollection';
import { Filter } from 'mongodb';

type Dependencies = {
  articleCollection: ArticleCollection;
};

const makeMongoFindArticles =
  ({ articleCollection }: Dependencies): FindArticles =>
  async ({ pagination, filter, sort }) => {
    let match: Filter<ArticleSchema> = {
      status: 'PUBLISHED',
      deleted: false,
    };

    if (filter.title) {
      match = {
        ...match,
        title: { $regex: `^${filter.title}`, $options: 'i' },
      };
    }

    if (filter.publishedBetween) {
      match = {
        ...match,
        publishedAt: {
          $gte: new Date(filter.publishedBetween[0]),
          $lt: new Date(filter.publishedBetween[1]),
        },
      };
    }

    const articles = await articleCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: Math.max(1 - pagination.page, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [{ $sort: sort.reduce((acc, { field, direction }) => ({ [field]: direction === 'asc' ? 1 : -1 }), {}) }]
          : []),
        {
          $lookup: {
            from: 'comment',
            as: 'comments',
            let: { articleId: '$_id' },
            pipeline: [
              {
                $match: {
                  deleted: false,
                  $expr: { $eq: ['$articleId', '$$articleId'] },
                },
              },
            ],
          },
        },
      ])
      .toArray<ArticleSchema & { comments: CommentSchema[]; publishedAt: Date }>();

    const totalElements = await articleCollection.countDocuments(match);

    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: articles.map((article) => ({
        id: MUUID.from(article._id).toString(),
        title: article.title,
        content: article.content,
        publishedAt: article.publishedAt,
        comments: article.comments.map((comment) => ({
          id: MUUID.from(comment._id).toString(),
          body: comment.body,
          createdAt: comment.createdAt,
        })),
      })),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  };

export { makeMongoFindArticles };
