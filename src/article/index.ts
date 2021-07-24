import { makeCreateArticle } from "@/article/application/CreateArticle";
import { makePublishArticle } from "@/article/application/PublishArticle";
import { makeInMemoryArticleRepository } from "@/article/infrastructure/InMemoryArticleRepository";
import { makeMemoryDB } from "@/article/infrastructure/MemoryDB";
import { makeArticleController } from "@/article/presentation/articleController";
import { makeFindArticles } from "@/article/query/FindArticles";
import { Module } from "@/lib/ddd";
import { Injector } from "@/lib/di/Injector";
import { asFunction } from "awilix";
import { Router } from "express";

type Dependencies = {
  apiRouter: Router;
};

const articleModule: Module = async (injector: Injector) => {
  const { container, inject, withInjector } = injector;

  container.register({
    memoryDB: asFunction(makeMemoryDB).singleton(),
    articleRepository: asFunction(makeInMemoryArticleRepository),
    createArticle: asFunction(makeCreateArticle),
    publishArticle: asFunction(makePublishArticle),
    findArticles: asFunction(makeFindArticles),
  });

  inject(({ apiRouter }: Dependencies) => {
    apiRouter.use(withInjector(makeArticleController));
  });
};

export { articleModule };
