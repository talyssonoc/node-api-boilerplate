import { articleModule } from "@/article";
import { makeInjector } from "@/lib/di/Injector";
import { AwilixContainer } from "awilix";
import { Application } from "express";

const modules = async (app: Application, container: AwilixContainer) => {
  const { withInjector } = makeInjector(container);

  await withInjector(articleModule);
};

export { modules };
