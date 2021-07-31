import { createContainer } from "awilix";

type Cradle = import("@/_boot").Container &
  import("@/_boot/server").Container &
  import("@/article").Container &
  import("@/comment").Container &
  Record<string, any>;

const container = createContainer<Cradle>();

type Container = typeof container;

export { container, Container };
