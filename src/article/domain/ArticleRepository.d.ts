type ArticleRepository = {
  getNextId(): Promise<string>;
  findById(id: string): Promise<Article>;
  store(entity: Article): Promise<void>;
}

export { ArticleRepository }