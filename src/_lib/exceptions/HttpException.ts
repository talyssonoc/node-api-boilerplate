type ErrorBody = {
  message?: string | Record<string, any>;
  error: string;
};

class HttpException extends Error {
  public readonly response: any;
  public readonly status: number;

  constructor(body: ErrorBody, status = 500) {
    super();

    this.status = status;

    if (!body.message) {
      this.response = { status, error: body.error };
    } else if (typeof body.message === "object") {
      this.response = body.message;
    } else {
      this.response = { ...body, status };
    }
  }
}

export { HttpException };
export type { ErrorBody };
