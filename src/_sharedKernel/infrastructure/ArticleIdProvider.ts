import { makeIdProvider } from '@/_lib/IdProvider';
import { ArticleId } from '@/_sharedKernel/domain/ArticleId';

const ArticleIdProvider = makeIdProvider<ArticleId>('ArticleId');

export { ArticleIdProvider };
