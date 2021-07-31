import jwt from "express-jwt";
import { NextFunction, Request, RequestHandler, Response } from "express";

type GuardExceptions = {
  method: string;
  match: string;
};

type JwtGuardProps = {
  secretKey: string;
  exceptions?: GuardExceptions[];
  credentialsRequired?: boolean;
  getToken?: (req: Request) => string;
};

const jwtGuard = (options: JwtGuardProps): RequestHandler[] => {
  const { secretKey, exceptions, credentialsRequired, getToken } = options;

  if (!secretKey) {
    throw new Error("secretKey must be supplied");
  }

  const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    if (exceptions) {
      if (exceptions.some((ex) => req.path.match(ex.match) && req.method === ex.method)) {
        return next();
      }
    }

    jwt({
      algorithms: ["RS256", "HS256"],
      secret: secretKey,
      credentialsRequired,
      getToken,
      requestProperty: "accessToken",
    })(req, res, next);
  };

  const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req && req.accessToken) {
      req.user = req.accessToken.user;
    }

    next();
  };

  return [checkJwt, authenticateRequest];
};

export { jwtGuard };
