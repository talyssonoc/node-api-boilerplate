import { createNamespace } from 'cls-hooked';
import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';

const ns = createNamespace('app.siriusweb');

// tslint:disable:ban-types
export class RequestContext {
  public static currentUser() {
    return ns.get('user');
  }

  public static defineUser(user) {
    ns.set('user', user);
  }

  public static get(key: string) {
    return ns.get(key);
  }

  public static set(key: string, value: any) {
    ns.set(key, value);
  }

  public static bindToCtx<T>(func: T & Function): T {
    return ns.bind(func);
  }

  public static runInCtx(func: (...args: any[]) => any) {
    ns.run(func);
  }

  public static bindEmitter(func: EventEmitter) {
    ns.bindEmitter(func);
  }

  public static middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      RequestContext.runInCtx(() => {
        next();
      });
    };
  }

  public static createCtx() {
    const boundedCtx = Object.create(ns);
    boundedCtx.get = boundedCtx.bind(ns.get);
    boundedCtx.set = boundedCtx.bind(ns.set);

    boundedCtx.bind = ns.bind.bind(ns);

    return boundedCtx;
  }

  public static rebindCtx(ctx = ns) {
    ctx.get = ns.bind(ns.get);
    ctx.set = ns.bind(ns.set);

    (ctx as any).bind = ns.bind.bind(ns);

    return ctx;
  }
}
