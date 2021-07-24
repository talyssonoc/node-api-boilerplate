namespace Article {
  type Article = Readonly<{
    id: string;
    title: string;
    content: string;
    state: "DRAFT" | "PUBLISHED" | "DELETED";
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  }>;

  type ArticleProps = Readonly<{
    id: string;
    title: string;
    content: string;
  }>;

  export const create = (props: ArticleProps): Article => ({
    id: props.id,
    title: props.title,
    content: props.content,
    state: "DRAFT",
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
  });

  export const publish = (self: Article): Article => ({
    ...self,
    state: "PUBLISHED",
    publishedAt: new Date(),
  });

  export const markAsDeleted = (self: Article): Article => ({
    ...self,
    state: "DELETED",
  });

  export const changeTitle = (self: Article, title: string): Article => ({
    ...self,
    title,
  });

  export type Type = Article;
}

export { Article };
