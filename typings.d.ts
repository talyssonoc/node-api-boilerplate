declare namespace Express {
  export interface Request {
    id: string;
    container: import("@/container").Container;
    accessToken: any;
  }
}
