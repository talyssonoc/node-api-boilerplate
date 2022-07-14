import { articleModule, ArticleRegistry } from '@/article';
import { ArticleMessages } from '@/article/messages';
import { authModule, AuthRegistry } from '@/auth';
import { commentModule, CommentRegistry } from '@/comment';

type AppModulesMessages = ArticleMessages;

type AppModulesConfig = {};

const appModules = [articleModule, commentModule, authModule];

type AppModulesRegistry = ArticleRegistry & CommentRegistry & AuthRegistry;

export { appModules };
export type { AppModulesMessages, AppModulesConfig, AppModulesRegistry };
