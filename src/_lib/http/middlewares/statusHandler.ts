import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
  startedAt: Date;
};

const statusHandler = handler(({ startedAt }: Dependencies) => async (_, res) => {
  const uptime = Math.round((Date.now() - startedAt.getTime()) / 10) / 100;

  res.status(HttpStatus.OK).json({
    startedAt,
    uptime,
  });
});

export { statusHandler };
