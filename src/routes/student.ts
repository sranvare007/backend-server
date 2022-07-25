import { globalConstants } from "./../../constants";
import { verifyJwt } from "./../middleware/auth";
import { Logger } from "./../utils/logger.utils";
import { CreateError } from "./../middleware/errorHandler";
import { Student } from "./../model/student";
import express from "express";

export const studentRouter = express.Router();

studentRouter.post("/student", verifyJwt, async (req, res, next) => {
  const {
    firstName,
    middleName,
    lastName,
    registrationId,
    course,
    admissionYear,
    emailId,
    phoneNumber,
    averageCGPA,
    photoUrl,
  } = req.body;
  try {
    const existingStudent = await Student.findOne({
      registrationId,
    });

    if (existingStudent) {
      throw CreateError.BadRequest(
        `Student with registration id ${registrationId} already exists.`
      );
    }

    const student = new Student({
      firstName,
      middleName,
      lastName,
      registrationId,
      course,
      admissionYear,
      emailId,
      phoneNumber,
      averageCGPA,
      photoUrl,
    });

    const validationError = student.validateSync();
    if (validationError) {
      throw CreateError.BadRequest(validationError.message);
    }

    await student.save();
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: "Student details inserted successdully.",
    });
  } catch (error: any) {
    Logger.error(`Error occured while inserting student data: ${error}`);
    next(error);
  }
});

studentRouter.put("/student/:id", verifyJwt, async (req, res, next) => {
  try {
    const existingStudent = Student.findOne({
      registrationId: req.params.id,
    });

    if (!existingStudent) {
      throw CreateError.NotFound(
        `Student with id ${req.params.id} does not exist.`
      );
    }
    const {
      firstName,
      middleName,
      lastName,
      course,
      admissionYear,
      emailId,
      phoneNumber,
      averageCGPA,
      photoUrl,
    } = req.body;
    await Student.findOneAndUpdate(
      {
        registrationId: req.params.id,
      },
      {
        firstName,
        middleName,
        lastName,
        course,
        admissionYear,
        emailId,
        phoneNumber,
        averageCGPA,
        photoUrl,
      }
    );
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: "Updated student data successfully.",
    });
  } catch (error) {
    Logger.error(
      `Error occured while updating student with id ${req.params.id}: ${error}`
    );
    next(error);
  }
});

studentRouter.get("/student/:id", verifyJwt, async (req, res, next) => {
  try {
    const student = await Student.findOne({
      registrationId: req.params.id,
    });
    if (!student) {
      throw CreateError.NotFound(`Student with id ${req.params.id} not found.`);
    }
    res.status(200).send({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: JSON.stringify(student),
    });
  } catch (error) {
    Logger.error(
      `Error occured while fetching student with id ${req.params.id}: ${error}`
    );
    next(error);
  }
});

studentRouter.delete("/student/:id", verifyJwt, async (req, res, next) => {
  try {
    const existingStudent = Student.findOne({
      registrationId: req.params.id,
    });

    if (!existingStudent) {
      throw CreateError.NotFound(
        `Student with id ${req.params.id} does not exist.`
      );
    }
    await Student.deleteOne({
      registrationId: req.params.id,
    });
    res.status(200).send({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: "Deleted data for student successfully.",
    });
  } catch (error) {
    Logger.error(
      `Error occoured while deleting student with id: ${req.params.id}: ${error}`
    );
    next(error);
  }
});

studentRouter.get("/student", verifyJwt, async (req, res, next) => {
  try {
    let students;
    if (req.query.minCGPA) {
      students = await Student.find({
        averageCGPA: {
          $gte: req.query.minCGPA,
        },
      });
    } else {
      students = await Student.find();
    }
    res.status(200).json({
      status: globalConstants.status.SUCCESS,
      message: globalConstants.status.SUCCESS,
      data: {
        students,
      },
    });
  } catch (error) {
    Logger.error(`Error occured while getting student details: ${error}`);
    next(error);
  }
});
