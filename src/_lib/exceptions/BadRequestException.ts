import { HttpException } from "./HttpException";
import { HttpStatus } from "../http/HttpStatus";

export class BadRequestException extends HttpException {
  constructor(message?: string | Record<string, any>, error = "Bad Request") {
    super({ message, error }, HttpStatus.BAD_REQUEST);
  }
}
