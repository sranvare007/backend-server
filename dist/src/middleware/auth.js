"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const errorHandler_1 = require("./errorHandler");
const logger_utils_1 = require("./../utils/logger.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwt = (req, _res, next) => {
    try {
        const authorization = req.headers["authorization"];
        const accessToken = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        if (!accessToken) {
            logger_utils_1.Logger.error("JWT authentication failed.");
            next(errorHandler_1.CreateError.Unauthorized("Invalid JWT Token"));
            return;
        }
        const decodedData = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.username = decodedData === null || decodedData === void 0 ? void 0 : decodedData.username;
        next();
    }
    catch (error) {
        logger_utils_1.Logger.error(`Failed to validate JWT Token: ${error}`);
        throw errorHandler_1.CreateError.Unauthorized("Something went wrong");
    }
};
exports.verifyJwt = verifyJwt;
