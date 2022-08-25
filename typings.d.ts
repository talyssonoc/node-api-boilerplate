declare module 'http' {
  export interface IncomingMessage {
    id?: string;
    container: import('@/container').Container;
  }
}
