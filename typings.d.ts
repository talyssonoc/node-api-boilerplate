declare module 'http' {
  export interface IncomingMessage {
    id?: string;
    container: import('@/container').Container;
    token?: { credentials: import('@/_lib/security/Credentials').Credentials.Type };
  }
}
