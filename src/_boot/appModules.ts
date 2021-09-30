import { articleModule, ArticleRegistry } from '@/article';
import { ArticleMessages } from '@/article/messages';
import { commentModule, CommentRegistry } from '@/comment';

type AppModulesMessages = ArticleMessages;

type AppModulesConfig = {};

const appModules = [articleModule, commentModule];

type AppModulesRegistry = ArticleRegistry & CommentRegistry;

export { appModules };
export type { AppModulesMessages, AppModulesConfig, AppModulesRegistry };
