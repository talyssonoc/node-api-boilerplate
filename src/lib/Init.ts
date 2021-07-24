import { Application } from "express";
import { AwilixContainer } from "awilix";

type InitFunction<T> = (app: Application, container: AwilixContainer, config: T) => void;

const init =
  <T>(fns: InitFunction<T>[]) =>
  async (app: Application, container: AwilixContainer, config: T) =>
    await fns.reduce((promise, fn) => promise.then(() => fn(app, container, config)), Promise.resolve());

export { init };
