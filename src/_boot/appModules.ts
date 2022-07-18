import { articleModule, ArticleRegistry } from '@/article';
import { ArticleMessages } from '@/article/messages';
import { authModule, AuthRegistry } from '@/auth';
import { JWTSignerConfig } from '@/auth/infrastructure/JWTSignerService';
import { commentModule, CommentRegistry } from '@/comment';
import { KeyPairConfig } from '@/_lib/certificates';

type AppModulesMessages = ArticleMessages;

type AppModulesConfig = KeyPairConfig & JWTSignerConfig;
//eu estou trazendo o jwt config direto do auth/infra isso está certo?

const appModules = [articleModule, commentModule, authModule];

type AppModulesRegistry = ArticleRegistry & CommentRegistry & AuthRegistry;

export { appModules };
export type { AppModulesMessages, AppModulesConfig, AppModulesRegistry };
