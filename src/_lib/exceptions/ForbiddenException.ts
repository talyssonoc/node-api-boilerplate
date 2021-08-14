import { HttpException } from "./HttpException";
import { HttpStatus } from "../http/HttpStatus";

export class ForbiddenException extends HttpException {
  constructor(message?: string | Record<string, any>, error = "Unauthorized") {
    super({ message, error }, HttpStatus.FORBIDDEN);
  }
}
