import { makeModule } from '@/context';
import { EnvironmentConfig } from '@/_lib/Environment';
import { makeNodeREPL } from '@/_lib/repl';

type REPLConfig = {
  appName: string;
  cli: boolean;
  repl: {
    port: number;
  };
  environment: EnvironmentConfig['environment'];
};

const repl = makeModule('repl', async ({ app: { onReady, terminate }, container, config, logger }) => {
  const repl = makeNodeREPL({ container, config, logger });

  onReady(async () => {
    await repl.start({ terminate });
  });

  return async () => {
    await repl.close();
  };
});

export { repl };
export type { REPLConfig };
