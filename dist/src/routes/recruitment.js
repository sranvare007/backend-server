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
exports.recruitmentRouter = void 0;
const constants_1 = require("./../../constants");
const auth_1 = require("./../middleware/auth");
const logger_utils_1 = require("./../utils/logger.utils");
const errorHandler_1 = require("./../middleware/errorHandler");
const express_1 = __importDefault(require("express"));
const recruitment_1 = require("../model/recruitment");
exports.recruitmentRouter = express_1.default.Router();
exports.recruitmentRouter.post("/recruitment", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, companyName, rolesHiring, eligibilityCriteria, ctcProvided, minCGPA, } = req.body;
    try {
        const existingRecruitment = yield recruitment_1.Recruitment.findOne({
            id,
        });
        if (existingRecruitment) {
            throw errorHandler_1.CreateError.BadRequest(`Recruitment with id ${id} already exists.`);
        }
        const recruitment = new recruitment_1.Recruitment({
            id,
            companyName,
            rolesHiring,
            eligibilityCriteria,
            ctcProvided,
            minCGPA,
        });
        const validationError = recruitment.validateSync();
        if (validationError) {
            throw errorHandler_1.CreateError.BadRequest(validationError.message);
        }
        yield recruitment.save();
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Recruitment details inserted successdully.",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while inserting recruitment data: ${error}`);
        next(error);
    }
}));
exports.recruitmentRouter.get("/recruitment/:id", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruitment = yield recruitment_1.Recruitment.findOne({
            id: req.params.id,
        });
        if (!recruitment) {
            throw errorHandler_1.CreateError.NotFound(`Recruitment details with id ${req.params.id} not found.`);
        }
        res.status(200).send({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: JSON.stringify(recruitment),
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while fetching recruitment details with id ${req.params.id}: ${error}`);
        next(error);
    }
}));
exports.recruitmentRouter.delete("/recruitment/:id", auth_1.verifyJwt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRecruitment = recruitment_1.Recruitment.findOne({
            id: req.params.id,
        });
        if (!existingRecruitment) {
            throw errorHandler_1.CreateError.NotFound(`Recruitment details with id ${req.params.id} does not exist.`);
        }
        yield recruitment_1.Recruitment.deleteOne({
            id: req.params.id,
        });
        res.status(200).send({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Deleted data for recruitment successfully.",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occoured while deleting recruitment details with id: ${req.params.id}: ${error}`);
        next(error);
    }
}));
exports.recruitmentRouter.get("/recruitment", auth_1.verifyJwt, (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruitment = yield recruitment_1.Recruitment.find();
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: {
                recruitment,
            },
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while getting student details: ${error}`);
        next(error);
    }
}));
