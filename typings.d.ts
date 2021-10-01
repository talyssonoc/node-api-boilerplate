declare namespace Express {
  export interface Request {
    id: string;
    container: import('@/container').Container;
    accessToken: any;
  }
}

declare module 'http' {
  export interface IncomingMessage {
    id: string;
    container: import('@/container').Container;
  }
}
