import { Request } from "express";

type PagingOptions = {
  pageParamName: string;
  limitParamName: string;
  sortParamName: string;
  searchParamName: string;
};

type PageConfig = {
  pageSize: number;
  page: number;
  filter: any;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
};

const defaultOptions: PagingOptions = {
  pageParamName: "page",
  limitParamName: "limit",
  sortParamName: "sort",
  searchParamName: "search",
};

const makePageable =
  (opts: Partial<PagingOptions> = {}) =>
  (req: Request): PageConfig => {
    const { query } = req;

    const options: PagingOptions = {
      ...defaultOptions,
      ...opts,
    };

    const pageSize = Number(query[options.limitParamName]) || 10;
    const page = Number(query[options.pageParamName]) || 1;
    const sort = String(query[options.sortParamName]) || null;
    const filter = query[options.searchParamName] || {};

    const pagination: PageConfig = {
      pageSize,
      page,
      filter,
    };

    if (sort) {
      pagination.sort = {
        field: sort.startsWith("-") ? sort.substr(1) : sort,
        direction: sort.startsWith("-") ? "desc" : "asc",
      };
    }

    return pagination;
  };

export { PagingOptions, PageConfig, makePageable };
