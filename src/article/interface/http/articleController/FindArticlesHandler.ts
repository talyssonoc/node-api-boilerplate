import { FindArticles } from '@/article/application/query/FindArticles';
import { handler } from '@/_lib/http/handler';
import Joi from 'types-joi';
import { makePaginator } from '@/_lib/http/validation/Paginator';

type Dependencies = {
  findArticles: FindArticles;
};

const { getFilter, getPagination, getSorter } = makePaginator({
  filter: Joi.object({
    title: Joi.string(),
    publishedBetween: Joi.array().items(Joi.date().iso().required()).min(2).max(2),
  }),
});

const findArticlesHandler = handler(({ findArticles }: Dependencies) => async (req, res) => {
  const filter = getFilter(req);
  const pagination = getPagination(req);
  const sort = getSorter(req);

  const articles = await findArticles({
    filter,
    sort,
    pagination,
  });

  res.json(articles);
});

export { findArticlesHandler };
