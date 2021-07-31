import { Container } from "@/container";

declare namespace Express {
  export interface Request {
    id: string;
    container: Container;
  }
}
