import { articleModule, ArticleRegistry } from '@/article';
import { commentModule, CommentRegistry } from '@/comment';

// eslint-disable-next-line @typescript-eslint/ban-types
type AppModulesConfig = {};

const appModules = [articleModule, commentModule];

type AppModulesRegistry = ArticleRegistry & CommentRegistry;

export { appModules };
export type { AppModulesConfig, AppModulesRegistry };
