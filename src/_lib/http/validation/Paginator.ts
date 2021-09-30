import { Request } from 'express';
import Joi, { InterfaceFrom } from 'types-joi';
import { ValidationError } from '@/_lib/errors/ValidationError';
import { BadRequestError } from '@/_lib/errors/BadRequestError';

type FieldConfig = {
  name: string;
  from: 'query' | 'params' | 'body';
};

type PaginatorOptions<T extends Record<string, any>> = {
  useDefaults?: boolean;
  fields?: {
    page?: string | FieldConfig;
    pageSize?: string | FieldConfig;
    sort?: string | FieldConfig;
    filter: string | FieldConfig;
  };
  defaults?: {
    pageSize?: number;
    page?: number;
    filter?: T['filter'] extends Joi.BaseSchema<any> ? NonNullable<InterfaceFrom<NonNullable<T['filter']>>> : any;
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    }[];
  };
  filter?: Joi.BaseSchema<any> | null;
};

type Paginator<T extends PaginatorOptions<Record<string, any>>> = {
  getPagination: (req: Request) => { page: number; pageSize: number };
  getFilter: (
    req: Request
  ) => T['filter'] extends Joi.BaseSchema<any> ? NonNullable<InterfaceFrom<NonNullable<T['filter']>>> : any;
  getSorter: (req: Request) => { field: string; direction: 'asc' | 'desc' }[];
};

const defaultOptions = {
  useDefaults: true,
  fields: {
    page: 'page',
    pageSize: 'limit',
    sort: 'sort',
    filter: 'filter',
  },
  defaults: {
    page: 1,
    pageSize: 10,
    sort: [],
    filter: {},
  },
  filter: null,
};

const makePaginator = <T extends PaginatorOptions<any>>(opts: Partial<T> = {}): Paginator<typeof opts> => {
  const { useDefaults, defaults, fields, filter } = {
    ...defaultOptions,
    ...opts,
    fields: {
      ...defaultOptions.fields,
      ...opts.fields,
    },
    defaults: {
      ...defaultOptions.defaults,
      ...opts.defaults,
    },
  };

  const getField = (field: string | FieldConfig): FieldConfig =>
    typeof field === 'string' ? { name: field, from: 'query' } : field;

  const fromRequest = (req: Request, field: FieldConfig) => req[field.from][field.name];

  const getPagination = (req: Request): { page: number; pageSize: number } => {
    const pageField = getField(fields.page);
    const pageSizeField = getField(fields.pageSize);

    const pageValue = Number(fromRequest(req, pageField));
    const pageSizeValue = Number(fromRequest(req, pageSizeField));

    if (!useDefaults && (isNaN(pageValue) || isNaN(pageSizeValue))) {
      throw BadRequestError.create(
        `Missing '${pageField.from}.${pageField.name}' or '${pageSizeField.from}.${pageSizeField.name}' values`
      );
    }

    return {
      page: isNaN(pageValue) ? defaults.page : pageValue,
      pageSize: isNaN(pageSizeValue) ? defaults.pageSize : pageSizeValue,
    };
  };

  const getSorter = (req: Request): { field: string; direction: 'asc' | 'desc' }[] => {
    const sortField = getField(fields.sort);
    const sortValues = fromRequest(req, sortField);

    if (!useDefaults && sortValues === undefined) {
      throw BadRequestError.create(`Missing '${sortField.from}.${sortField.name}' value`);
    }

    const sortList: string[] = Array.isArray(sortValues) ? sortValues : sortValues ? [sortValues] : [];

    return sortList.length
      ? sortList.map((sort) => ({
          field: sort.startsWith('-') ? sort.substr(1) : sort,
          direction: sort.startsWith('-') ? 'desc' : 'asc',
        }))
      : defaults.sort;
  };

  const getFilter = (
    req: Request
  ): T['filter'] extends Joi.BaseSchema<any> ? NonNullable<InterfaceFrom<NonNullable<T['filter']>>> : any => {
    const filterField = getField(fields.filter);
    const filterValue = fromRequest(req, filterField);

    if (!filter) {
      if (!useDefaults && filterValue === undefined) {
        throw BadRequestError.create(`Missing '${filterField.from}.${filterField.name}' value`);
      }

      return filterValue ?? defaults.filter;
    }

    const { error } = Joi.object({ filter: filter as unknown as Joi.AnySchema<any> })
      .options({ allowUnknown: true })
      .validate(req[filterField.from]);

    if (error) {
      throw ValidationError.create({ target: filterField.name, error });
    }

    return filterValue ?? defaults.filter;
  };

  return {
    getFilter,
    getPagination,
    getSorter,
  };
};

export { makePaginator };
