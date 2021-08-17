import { makeContext } from "@/_lib/Context";
import { container } from "@/container";
import { config } from "@/config";
import { logger } from "@/_lib/logger";

const { withContext, makeModule } = makeContext({ config, container, logger }, { logger });

export { withContext, makeModule };
