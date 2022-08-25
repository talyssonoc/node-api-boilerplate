import { Request, RequestHandler } from 'express';
import logger, { Options, startTime } from 'pino-http';
import { randomUUID } from 'crypto';

type LoggerOptions = Options & { customProps?: (req: Request, res: Response) => any };

const httpLoggerOptions = (): LoggerOptions => {
  const getReqId = (req: Request) => `[req:${req.id}]`;

  return {
    genReqId: () => randomUUID(),
    autoLogging: { ignorePaths: ['/status', '/favicon.ico'] },
    customSuccessMessage: function (res) {
      const req = res.req as Request;

      const reqId = getReqId(req);

      return `${reqId} ${res.statusCode} - ${req.method} ${req.originalUrl} ${Date.now() - res[startTime]}ms`;
    },
    customErrorMessage: function (error, res) {
      const req = res.req as Request;

      const reqId = getReqId(req);

      return `${reqId} ${res.statusCode} - ${req.method} ${req.originalUrl} - [${error.name}] ${error.message} ${
        Date.now() - res[startTime]
      }ms`;
    },
    customLogLevel: function (res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'trace';
      }
      return 'info';
    },
  };
};

const httpLogger = (opts: LoggerOptions = httpLoggerOptions()): RequestHandler =>
  logger({
    ...opts,
  });

export { httpLogger, httpLoggerOptions, startTime as reqStartTimeKey };
export type { LoggerOptions };
