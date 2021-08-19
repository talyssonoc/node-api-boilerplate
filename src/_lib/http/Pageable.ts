import { Request } from "express";
import Joi, { InterfaceFrom } from "types-joi";
import { ValidationError } from "@/_lib/http/validation/ValidationError";

type PagingOptions<T extends Record<string, any>> = {
  params?: {
    page: string;
    pageSize: string;
    sort: string;
    filter: string;
  };
  defaults?: Partial<PageConfig<T>>;
  filter?: Joi.BaseSchema<any> | null;
};

type PageConfig<T extends PagingOptions<Record<string, any>>> = {
  pageSize: number;
  page: number;
  filter: T["filter"] extends Joi.BaseSchema<any> ? NonNullable<InterfaceFrom<NonNullable<T["filter"]>>> : any;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
};

const defaultOptions: Required<PagingOptions<Record<string, any>>> = {
  params: {
    page: "page",
    pageSize: "limit",
    sort: "sort",
    filter: "filter",
  },
  defaults: {
    page: 1,
    pageSize: 10,
  },
  filter: null,
};

const makePageable =
  <T extends PagingOptions<any>>(opts: T) =>
  (req: Request): PageConfig<typeof opts> => {
    const { query } = req;

    const options = {
      ...defaultOptions,
      ...opts,
    };

    const pageSize = Number(query[options.limitParamName]) || 10;
    const page = Number(query[options.pageParamName]) || 1;
    const sort = String(query[options.sortParamName]) || null;
    let filter;

    if (options.filter) {
      const { value, error } = (options.filter as Joi.BaseSchema<any>).validate(query[options.filterParamName]);

      if (error) {
        throw ValidationError.create({ target: options.filterParamName, error });
      }

      filter = value || {};
    } else {
      filter = query[options.filterParamName] || {};
    }

    const pagination: PageConfig<T> = {
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

export { makePageable };
export type { PagingOptions, PageConfig };
