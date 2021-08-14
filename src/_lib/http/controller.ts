import { RequestHandler } from "express";
import { asFunction } from "awilix";
import { AsyncHandler, runAsync } from "@/_lib/http/runAsync";

type ControllerHandler = (dependencies: any) => AsyncHandler;

const controller = (handler: ControllerHandler): RequestHandler => {
  const resolver = asFunction(handler);

  return (req, res, next) => {
    const injectedHandler = req.container.build(resolver);

    return runAsync(injectedHandler)(req, res, next);
  };
};

export { controller };
