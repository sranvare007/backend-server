import { globalConstants } from "./../../constants";
import { ErrorRequestHandler, Request, Response } from "express";

export class CreateError extends Error {
  public status: number;
  public clientMessage: string;
  public serverMessage: string;

  public constructor(
    status: number,
    serverMessage: string,
    clientMessage: string
  ) {
    super(serverMessage);
    this.status = status;
    this.clientMessage = clientMessage;
    this.serverMessage = serverMessage;
  }

  static NoContent(serverMessage: string, clientMessage: string): CreateError {
    return new CreateError(204, serverMessage, clientMessage);
  }

  static BadRequest(
    serverMessage: string,
    clientMessage?: string
  ): CreateError {
    return new CreateError(400, serverMessage, clientMessage || "Bad Request");
  }

  static Unauthorized(
    serverMessage: string,
    clientMessage?: string
  ): CreateError {
    return new CreateError(401, serverMessage, clientMessage || "Unauthorized");
  }

  static Forbidden(serverMessage: string, clientMessage?: string): CreateError {
    return new CreateError(403, serverMessage, clientMessage || "Forbidden");
  }

  static NotFound(serverMessage: string, clientMessage?: string): CreateError {
    return new CreateError(404, serverMessage, clientMessage || "Not Found");
  }

  static Conflict(serverMessage: string, clientMessage?: string): CreateError {
    return new CreateError(409, serverMessage, clientMessage || "Conflict");
  }

  static MethodNotAllowed(
    serverMessage: string,
    clientMessage?: string
  ): CreateError {
    return new CreateError(
      405,
      serverMessage,
      clientMessage || "Method Not Allowed"
    );
  }

  static TooManyRequests(
    serverMessage: string,
    clientMessage?: string
  ): CreateError {
    return new CreateError(
      429,
      serverMessage,
      clientMessage || "Too Many Requests"
    );
  }

  static InternalServerError(
    serverMessage: string,
    clientMessage?: string
  ): CreateError {
    return new CreateError(
      500,
      serverMessage,
      clientMessage || "Internal Server Error"
    );
  }
}

export const HandleError: ErrorRequestHandler = (
  error: CreateError,
  _req: Request,
  res: Response
) => {
  const status = error.status || 500;
  const clientMessage = error.clientMessage || "Something went wrong";
  const serverMessage = error.serverMessage || "Something went wrong";

  res.status(status).json({
    status: globalConstants.status.FAILED,
    clientMessage,
    serverMessage,
  });
};
