import { makeContext } from '@/_lib/Context';
import { container } from '@/container';
import { config } from '@/config';
import { logger } from '@/_lib/logger';
import { messageBundle } from '@/messages';

const { withContext, makeModule } = makeContext({ config, container, logger, messageBundle }, { logger });

export { withContext, makeModule };
