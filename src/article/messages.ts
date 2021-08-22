import { MessageSource } from "@/_lib/message/MessageBundle";

type ArticleMessages = {
  article: {
    notFound: { id: string };
    alreadyPublished: { id: string; publishedAt: Date };
  };
};

const articleMessages: MessageSource<ArticleMessages> = {
  article: {
    alreadyPublished: "Can't republish the article #({{ id }}) because it was already published on {{ publishedAt }}",
    notFound: "Can't find article #({{ id }})",
  },
};

export { articleMessages };
export type { ArticleMessages };
