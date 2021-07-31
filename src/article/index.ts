import { CreateArticle, makeCreateArticle } from "@/article/application/CreateArticle";
import { makePublishArticle, PublishArticle } from "@/article/application/PublishArticle";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { makeInMemoryArticleRepository } from "@/article/infrastructure/InMemoryArticleRepository";
import { makeArticleController } from "@/article/presentation/articleController";
import { FindArticles, makeFindArticles } from "@/article/query/FindArticles";
import { InitFunction } from "@/_lib/AppInitializer";
import { asFunction } from "awilix";

const articleModule: InitFunction = async ({ register, build }) => {
  register({
    articleRepository: asFunction(makeInMemoryArticleRepository),
    createArticle: asFunction(makeCreateArticle),
    publishArticle: asFunction(makePublishArticle),
    findArticles: asFunction(makeFindArticles),
  });

  build(makeArticleController);
};

type Container = {
  articleRepository: ArticleRepository;
  createArticle: CreateArticle;
  publishArticle: PublishArticle;
  findArticles: FindArticles;
};

export { articleModule, Container };
