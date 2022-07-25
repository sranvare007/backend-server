"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRouter = void 0;
const constants_1 = require("./../../constants");
const auth_1 = require("./../middleware/auth");
const logger_utils_1 = require("./../utils/logger.utils");
const errorHandler_1 = require("./../middleware/errorHandler");
const student_1 = require("./../model/student");
const express_1 = __importDefault(require("express"));
exports.studentRouter = express_1.default.Router();
exports.studentRouter.post("/student", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, middleName, lastName, registrationId, course, admissionYear, emailId, phoneNumber, averageCGPA, photoUrl, } = req.body;
    try {
        const existingStudent = yield student_1.Student.findOne({
            registrationId,
        });
        if (existingStudent) {
            throw errorHandler_1.CreateError.BadRequest(`Student with registration id ${registrationId} already exists.`);
        }
        const student = new student_1.Student({
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
            throw errorHandler_1.CreateError.BadRequest(validationError.message);
        }
        yield student.save();
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Student details inserted successdully.",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while inserting student data: ${error}`);
        next(error);
    }
}));
exports.studentRouter.put("/student/:id", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingStudent = student_1.Student.findOne({
            registrationId: req.params.id,
        });
        if (!existingStudent) {
            throw errorHandler_1.CreateError.NotFound(`Student with id ${req.params.id} does not exist.`);
        }
        const { firstName, middleName, lastName, course, admissionYear, emailId, phoneNumber, averageCGPA, photoUrl, } = req.body;
        yield student_1.Student.findOneAndUpdate({
            registrationId: req.params.id,
        }, {
            firstName,
            middleName,
            lastName,
            course,
            admissionYear,
            emailId,
            phoneNumber,
            averageCGPA,
            photoUrl,
        });
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Updated student data successfully.",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while updating student with id ${req.params.id}: ${error}`);
        next(error);
    }
}));
exports.studentRouter.get("/student/:id", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield student_1.Student.findOne({
            registrationId: req.params.id,
        });
        if (!student) {
            throw errorHandler_1.CreateError.NotFound(`Student with id ${req.params.id} not found.`);
        }
        res.status(200).send({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: JSON.stringify(student),
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while fetching student with id ${req.params.id}: ${error}`);
        next(error);
    }
}));
exports.studentRouter.delete("/student/:id", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingStudent = student_1.Student.findOne({
            registrationId: req.params.id,
        });
        if (!existingStudent) {
            throw errorHandler_1.CreateError.NotFound(`Student with id ${req.params.id} does not exist.`);
        }
        yield student_1.Student.deleteOne({
            registrationId: req.params.id,
        });
        res.status(200).send({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Deleted data for student successfully.",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occoured while deleting student with id: ${req.params.id}: ${error}`);
        next(error);
    }
}));
exports.studentRouter.get("/student", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let students;
        if (req.query.minCGPA) {
            students = yield student_1.Student.find({
                averageCGPA: {
                    $gte: req.query.minCGPA,
                },
            });
        }
        else {
            students = yield student_1.Student.find();
        }
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: {
                students,
            },
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while getting student details: ${error}`);
        next(error);
    }
}));
