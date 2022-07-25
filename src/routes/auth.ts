import { Logger } from "./../utils/logger.utils";
import { globalConstants } from "./../../constants";
import { User } from "./../model/user";
import { CreateError } from "./../middleware/errorHandler";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../middleware/auth";

export const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    const error = user.validateSync();
    if (error) {
      throw CreateError.BadRequest(error.message);
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      throw CreateError.BadRequest("Username already exists.");
    }

    await user.save();
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        username: req.body.username,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );
    Logger.info(`New user with username ${req.body.username} created.`);
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: {
        jwt: jwtToken,
      },
    });
  } catch (error: any) {
    Logger.error(`Error occoured: ${error}`);
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      throw CreateError.BadRequest("Invalid Login details!");
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const jwtToken = jwt.sign(
        {
          userId: user._id,
          username: req.body.username,
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "7d" }
      );
      // res.cookie("jwtoken", jwtToken, {
      //   expires: new Date(Date.now() + 604800000),
      //   httpOnly: true,
      // });
      res.status(200).json({
        status: globalConstants.status.SUCCESS,
        message: globalConstants.status.SUCCESS,
        data: {
          jwt: jwtToken,
        },
      });
      return;
    }
    throw CreateError.BadRequest("Invalid Login details!");
  } catch (error: any) {
    Logger.error(`Error occoured while login: ${error}`);
    next(error);
  }
});

userRouter.get("/userInfo", verifyJwt, async (req, res) => {
  const user = await User.findOne({
    username: req.username,
  });
  res.send(user);
});
