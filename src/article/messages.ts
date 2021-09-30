import { messageSource } from '@/_lib/message/MessageBundle';

type ArticleMessages = {
  article: {
    error: {
      notFound: { id: string };
      alreadyPublished: { id: string; publishedAt: Date };
    };
    created: { id: string };
    published: { id: string; publishedAt: Date };
  };
};

const articleMessages = messageSource<ArticleMessages>({
  article: {
    error: {
      alreadyPublished:
        "Can't republish the article #({{ id }}) because it was already published on {{ publishedAt.toISOString() }}",
      notFound: "Can't find article #({{ id }})",
    },
    created: 'Article created with id #({{ id }})',
    published: 'Published article #({{ id }}) at {{ publishedAt.toISOString() }}',
  },
});

export { articleMessages };
export type { ArticleMessages };
