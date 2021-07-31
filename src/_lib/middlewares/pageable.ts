import { makePageable, PagingOptions } from "@/_lib/Pageable";

const pageable = (opts?: Partial<PagingOptions>) => {
  const getPagination = makePageable(opts);

  return (req, res, next) => {
    req.pagination = getPagination(req);

    next();
  };
};

export { pageable };
