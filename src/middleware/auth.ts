import { CreateError } from "./errorHandler";
import { Logger } from "./../utils/logger.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface UserPayload extends JwtPayload {
  username: string;
}

export const verifyJwt = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers["authorization"];
    const accessToken = authorization?.split(" ")[1];
    if (!accessToken) {
      Logger.error("JWT authentication failed.");
      next(CreateError.Unauthorized("Invalid JWT Token"));
      return;
    }
    const decodedData = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY as string
    ) as UserPayload;
    req.username = decodedData?.username;
    next();
  } catch (error) {
    Logger.error(`Failed to validate JWT Token: ${error}`);
    throw CreateError.Unauthorized("Something went wrong");
  }
};
