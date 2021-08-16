import { createContainer } from "awilix";
import { MainRegistry } from "@/_boot";
import { DatabaseRegistry } from "@/_boot/database";
import { ServerRegistry } from "@/_boot/server";
import { ArticleRegistry } from "@/article";
import { CommentRegistry } from "@/comment";

type Registry = MainRegistry & DatabaseRegistry & ServerRegistry & ArticleRegistry & CommentRegistry;

const container = createContainer<Registry>();

type Container = typeof container;

export { container, Container, Registry };
