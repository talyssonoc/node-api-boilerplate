import { HttpException } from "./HttpException";
import { HttpStatus } from "../http/HttpStatus";

export class NotFoundException extends HttpException {
  constructor(message?: string | Record<string, any>, error = "Not Found") {
    super({ message, error }, HttpStatus.NOT_FOUND);
  }
}
