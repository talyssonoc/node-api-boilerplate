import { makePaginator, PagingOptions } from "@/_lib/http/validation/Paginator";

const pageable = (opts?: Partial<PagingOptions>) => {
  const getPagination = makePaginator(opts);

  return (req, res, next) => {
    req.pagination = getPagination(req);

    next();
  };
};

export { pageable };
