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
exports.mailRouter = void 0;
const student_1 = require("./../model/student");
const logger_utils_1 = require("./../utils/logger.utils");
const constants_1 = require("./../../constants");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
exports.mailRouter = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.mailRouter.post("/mail", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailList = yield student_1.Student.find({
            admissionYear: {
                $eq: req.body.admissionYear,
            },
        }, {
            emailId: 1,
            _id: 0,
        });
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
            logger_utils_1.Logger.info(`Sending mail to ${mail.emailId}`);
            yield mail_1.default.send(Object.assign(Object.assign({}, msg), { to: mail.emailId }));
        }
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: "Email sent out successfully",
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occured while sending mail: ${error}`);
        next(error);
    }
}));
