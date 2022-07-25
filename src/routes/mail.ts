import { Student } from "./../model/student";
import { Logger } from "./../utils/logger.utils";
import { globalConstants } from "./../../constants";
import sgMail from "@sendgrid/mail";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const mailRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
mailRouter.post("/mail", async (req, res, next) => {
  try {
    const emailList = await Student.find(
      {
        admissionYear: {
          $eq: req.body.admissionYear,
        },
      },
      {
        emailId: 1,
        _id: 0,
      }
    );
    const msg = {
      from: {
        email: "surajranvare.sr@gmail.com",
        name: "Training & Placement Cell",
      },
      subject: req.body.emailSubject,
      text: req.body.emailText,
      html: req.body.htmlText,
    };

    for (const mail of emailList) {
      Logger.info(`Sending mail to ${mail.emailId}`);
      await sgMail.send({ ...msg, to: mail.emailId });
    }

    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: "Email sent out successfully",
    });
  } catch (error) {
    Logger.error(`Error occured while sending mail: ${error}`);
    next(error);
  }
});
