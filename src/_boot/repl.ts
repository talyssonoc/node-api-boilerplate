import { makeModule } from '@/context';
import { makeREPL } from '@/_lib/repl';

type REPLConfig = { appName: string; environment: string; cli: boolean; repl: { port: number } };

const repl = makeModule('repl', async ({ app: { onReady, terminate }, container, config, logger }) => {
  const repl = makeREPL({
    context: { registry: container.cradle, container },
    cli: config.cli,
    prompt: config.appName,
    remote: !['production', 'test'].includes(config.environment) && config.repl,
    logger,
  });

  onReady(async () => {
    await repl.start({ terminate });
  });

  return async () => {
    await repl.close();
  };
});

export { repl };
export type { REPLConfig };
