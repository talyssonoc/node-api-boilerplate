import { makeContext } from '@/_lib/Context';
import { container, initialize } from '@/container';
import { config } from '@/config';
import { logger } from '@/_lib/logger';

const { withContext, makeModule } = makeContext({ config, container, logger, initialize }, { logger });

export { withContext, makeModule };
