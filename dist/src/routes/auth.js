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
exports.userRouter = void 0;
const logger_utils_1 = require("./../utils/logger.utils");
const constants_1 = require("./../../constants");
const user_1 = require("./../model/user");
const errorHandler_1 = require("./../middleware/errorHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = new user_1.User({
            username: req.body.username,
            password: hashedPassword,
        });
        const error = user.validateSync();
        if (error) {
            throw errorHandler_1.CreateError.BadRequest(error.message);
        }
        const existingUser = yield user_1.User.findOne({
            username: req.body.username,
        });
        if (existingUser) {
            throw errorHandler_1.CreateError.BadRequest("Username already exists.");
        }
        yield user.save();
        const jwtToken = jsonwebtoken_1.default.sign({
            userId: user._id,
            username: req.body.username,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        logger_utils_1.Logger.info(`New user with username ${req.body.username} created.`);
        res.status(200).json({
            status: constants_1.globalConstants.status.SUCCESS,
            message: constants_1.globalConstants.status.SUCCESS,
            data: {
                jwt: jwtToken,
            },
        });
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occoured: ${error}`);
        next(error);
    }
}));
exports.userRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_1.User.findOne({
            username: username,
        });
        if (!user) {
            throw errorHandler_1.CreateError.BadRequest("Invalid Login details!");
        }
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            const jwtToken = jsonwebtoken_1.default.sign({
                userId: user._id,
                username: req.body.username,
            }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
            // res.cookie("jwtoken", jwtToken, {
            //   expires: new Date(Date.now() + 604800000),
            //   httpOnly: true,
            // });
            res.status(200).json({
                status: constants_1.globalConstants.status.SUCCESS,
                message: constants_1.globalConstants.status.SUCCESS,
                data: {
                    jwt: jwtToken,
                },
            });
            return;
        }
        throw errorHandler_1.CreateError.BadRequest("Invalid Login details!");
    }
    catch (error) {
        logger_utils_1.Logger.error(`Error occoured while login: ${error}`);
        next(error);
    }
}));
exports.userRouter.get("/userInfo", auth_1.verifyJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({
        username: req.username,
    });
    res.send(user);
}));
