import { makeModule } from '@/context';
import { makeREPL, REPLConfigType } from '@/_lib/repl';

type REPLConfig = REPLConfigType<{ appName: string; cli: boolean; repl: { port: number } }>;

const repl = makeModule('repl', async ({ app: { onReady, terminate }, container, config, logger }) => {
  const repl = makeREPL({ container, config, logger });

  onReady(async () => {
    await repl.start({ terminate });
  });

  return async () => {
    await repl.close();
  };
});

export { repl };
export type { REPLConfig };
