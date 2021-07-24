import { asValue, AwilixContainer } from "awilix";
import { Application, Router } from "express";

const routes = async (app: Application, container: AwilixContainer) => {
  const rootRouter = Router();
  const apiRouter = Router();

  rootRouter.use("/api", apiRouter);

  app.use(rootRouter);

  container.register({
    rootRouter: asValue(rootRouter),
    apiRouter: asValue(apiRouter),
  });
};

export { routes };
