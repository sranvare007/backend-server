import { mailRouter } from "./routes/mail";
import { recruitmentRouter } from "./routes/recruitment";
import { userRouter } from "./routes/auth";
import { Logger } from "./utils/logger.utils";
import { Urls } from "./../urls";
import { HandleError } from "./middleware/errorHandler";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { studentRouter } from "./routes/student";

dotenv.config();

const port = process.env.PORT || 80;
const app = express();
app.use(express.json());
app.use(cors());

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      username: string;
    }
  }
}

mongoose
  .connect(Urls.MONDO_DB_CONNECTION_URL)
  .then(() => {
    Logger.info(`Connected to the database successfully.`);
  })
  .catch((error) => {
    Logger.error(`Error connecting to the database: ${error}`);
  });

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use("/", userRouter);
app.use("/", studentRouter);
app.use("/", recruitmentRouter);
app.use("/", mailRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  HandleError(err, req, res, next);
});
