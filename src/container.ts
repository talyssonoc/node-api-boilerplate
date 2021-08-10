import { createContainer } from "awilix";

type Cradle = import("@/_boot").Container &
  import("@/_boot/database").Container &
  import("@/_boot/server").Container &
  import("@/article").Container &
  import("@/comment").Container;

const container = createContainer<Cradle>();

type Container = typeof container;

export { container, Container, Cradle };
