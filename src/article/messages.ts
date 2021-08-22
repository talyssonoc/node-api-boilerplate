import { messageSource } from "@/_lib/message/MessageBundle";

type ArticleMessages = {
  article: {
    error: {
      notFound: { id: string };
      alreadyPublished: { id: string; publishedAt: Date };
    };
    created: { id: string };
  };
};

const articleMessages = messageSource<ArticleMessages>({
  article: {
    error: {
      alreadyPublished: "Can't republish the article #({{ id }}) because it was already published on {{ publishedAt }}",
      notFound: "Can't find article #({{ id }})",
    },
    created: "Article created with id #({{ id }})",
  },
});

export { articleMessages };
export type { ArticleMessages };
