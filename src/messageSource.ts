type MessageParameters = {
  "article.not.found": { id: string };
  "article.already.published": { id: string; publishedAt: Date };
};

type MessageSource = {
  [key in keyof MessageParameters]: string;
};

const { messageBundle, updateBundle } = (messageSrc: Partial<MessageSource> = {}) => {
  let bundle = messageSrc;

  return {
    messageBundle: new Proxy(
      {},
      {
        get: (target, name) => {
          return bundle[name] || "";
        },
      }
    ),
    updateBundle: (newBundle: Partial<MessageSource>) => {
      bundle = { ...bundle, ...newBundle };
    },
  };
};

export type { MessageParameters };
