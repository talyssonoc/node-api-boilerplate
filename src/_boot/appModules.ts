import { articleModule, ArticleRegistry } from '@/article';
import { ArticleMessages } from '@/article/messages';
import { commentModule, CommentRegistry } from '@/comment';

type AppModulesMessages = ArticleMessages;


const appModules = [articleModule, commentModule];

type AppModulesRegistry = ArticleRegistry & CommentRegistry;

export { appModules };
export type { AppModulesMessages, AppModulesRegistry };
