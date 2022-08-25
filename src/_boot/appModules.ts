import { articleModule, ArticleRegistry } from '@/article';
import { authModule, AuthRegistry } from '@/auth';
import { commentModule, CommentRegistry } from '@/comment';

// eslint-disable-next-line @typescript-eslint/ban-types
type AppModulesConfig = {};

const appModules = [authModule, articleModule, commentModule];

type AppModulesRegistry = AuthRegistry & ArticleRegistry & CommentRegistry;

export { appModules };
export type { AppModulesConfig, AppModulesRegistry };
