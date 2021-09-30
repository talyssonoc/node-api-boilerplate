import { Article } from '@/article/domain/Article';
import { ArticleSchema } from '@/article/infrastructure/ArticleCollection';
import { DataMapper } from '@/_lib/DDD';
import { ArticleIdProvider } from '@/_sharedKernel/infrastructure/ArticleIdProvider';
import { from } from 'uuid-mongodb';

const ArticleMapper: DataMapper<Article.Type, ArticleSchema> = {
  toData: (entity: Article.Type) => ({
    _id: from(entity.id.value),
    title: entity.title,
    content: entity.content,
    status: entity.state,
    publishedAt: entity.publishedAt,
    createdAt: entity.createdAt,
    deleted: entity.state === 'DELETED',
    updatedAt: entity.createdAt,
    version: entity.version,
  }),
  toEntity: (data: ArticleSchema) => ({
    id: ArticleIdProvider.create(from(data._id).toString()),
    title: data.title,
    content: data.content,
    state: data.status,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
    version: data.version,
  }),
};

export { ArticleMapper };
