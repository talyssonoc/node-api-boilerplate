import { HttpException } from "@/_lib/exceptions/HttpException";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "@/_lib/http/validation/ValidationError";

const errorHandler = () => (err: HttpException | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof HttpException) {
    res.status(err.status).json(err.response);
  } else if (ValidationError.is(err)) {
    res.status(err.target === "body" ? 422 : 400).json(err.error);
  } else {
    res.status(500).json({ error: err.message });
  }
};

export { errorHandler };