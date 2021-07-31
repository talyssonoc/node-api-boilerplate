namespace Comment {
  type Comment = Readonly<{
    id: string;
    body: string;
    createdAt: Date;
  }>;

  type CommentProps = Readonly<{
    id: string;
    body: string;
  }>;

  export const create = (props: CommentProps): Comment => ({
    ...props,
    createdAt: new Date(),
  });

  export type Type = Comment;
}

export { Comment };
