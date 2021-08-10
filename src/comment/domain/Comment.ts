namespace Comment {
  type Status = "ACTIVE" | "DELETED";

  type Comment = Readonly<{
    id: string;
    body: string;
    articleId: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  }>;

  type CommentProps = Readonly<{
    id: string;
    body: string;
    articleId: string;
  }>;

  export const create = (props: CommentProps): Comment => ({
    ...props,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0
  });

  export const markAsDeleted = (self: Comment): Comment => ({
    ...self,
    status: "DELETED"
  })

  export type Type = Comment;
}

export { Comment };
