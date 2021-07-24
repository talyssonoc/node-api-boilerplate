import { AwilixContainer } from "awilix";
import { Application, Request, Response } from "express";

const errorHandler = async (app: Application, container: AwilixContainer) => {
  app.use((req: Request, res: Response) => {
    res.sendStatus(404);
  });

  app.use((err: Error, req: Request, res: Response) => {
    console.error(err);

    res.status(400).json({ error: err.message });
  });
};

export { errorHandler };
