import { globalConstants } from "./../../constants";
import { verifyJwt } from "./../middleware/auth";
import { Logger } from "./../utils/logger.utils";
import { CreateError } from "./../middleware/errorHandler";
import express from "express";
import { Recruitment } from "../model/recruitment";

export const recruitmentRouter = express.Router();

recruitmentRouter.post("/recruitment", verifyJwt, async (req, res, next) => {
  const {
    id,
    companyName,
    rolesHiring,
    eligibilityCriteria,
    ctcProvided,
    minCGPA,
  } = req.body;
  try {
    const existingRecruitment = await Recruitment.findOne({
      id,
    });

    if (existingRecruitment) {
      throw CreateError.BadRequest(`Recruitment with id ${id} already exists.`);
    }

    const recruitment = new Recruitment({
      id,
      companyName,
      rolesHiring,
      eligibilityCriteria,
      ctcProvided,
      minCGPA,
    });

    const validationError = recruitment.validateSync();
    if (validationError) {
      throw CreateError.BadRequest(validationError.message);
    }

    await recruitment.save();
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: "Recruitment details inserted successdully.",
    });
  } catch (error: any) {
    Logger.error(`Error occured while inserting recruitment data: ${error}`);
    next(error);
  }
});

recruitmentRouter.get("/recruitment/:id", verifyJwt, async (req, res, next) => {
  try {
    const recruitment = await Recruitment.findOne({
      id: req.params.id,
    });
    if (!recruitment) {
      throw CreateError.NotFound(
        `Recruitment details with id ${req.params.id} not found.`
      );
    }
    res.status(200).send({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: JSON.stringify(recruitment),
    });
  } catch (error) {
    Logger.error(
      `Error occured while fetching recruitment details with id ${req.params.id}: ${error}`
    );
    next(error);
  }
});

recruitmentRouter.delete(
  "/recruitment/:id",
  verifyJwt,
  async (req, res, next) => {
    try {
      const existingRecruitment = Recruitment.findOne({
        id: req.params.id,
      });

      if (!existingRecruitment) {
        throw CreateError.NotFound(
          `Recruitment details with id ${req.params.id} does not exist.`
        );
      }
      await Recruitment.deleteOne({
        id: req.params.id,
      });
      res.status(200).send({
        status: globalConstants.status.SUCCESS,
        message: globalConstants.status.SUCCESS,
        data: "Deleted data for recruitment successfully.",
      });
    } catch (error) {
      Logger.error(
        `Error occoured while deleting recruitment details with id: ${req.params.id}: ${error}`
      );
      next(error);
    }
  }
);

recruitmentRouter.get("/recruitment", verifyJwt, async (_req, res, next) => {
  try {
    const recruitment = await Recruitment.find();
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: {
        recruitment,
      },
    });
  } catch (error) {
    Logger.error(`Error occured while getting student details: ${error}`);
    next(error);
  }
});
