type Article = Readonly<{
  id: string;
  title: string;
  content: string;
  state: 'DRAFT' | 'PUBLISHED' | 'DELETED';
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}>;

type ArticleProps = Readonly<{
  id: string;
  title: string;
  content: string;
}>

const create = (props: ArticleProps): Article => ({
  id: props.id,
  title: props.title,
  content: props.content,
  state: 'DRAFT',
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 0
});

const publish = (self: Article): Article => ({
  ...self,
  state: 'PUBLISHED',
  publishedAt: new Date()
});

const markAsDeleted = (self: Article): Article => ({
  ...self,
  state: 'DELETED'
});

const changeTitle = (self: Article, title: string): Article => ({
  ...self,
  title
});

export default Article;
export { Article as Type, create, publish, markAsDeleted, changeTitle };