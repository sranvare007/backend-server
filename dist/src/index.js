"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("./routes/mail");
const recruitment_1 = require("./routes/recruitment");
const auth_1 = require("./routes/auth");
const logger_utils_1 = require("./utils/logger.utils");
const urls_1 = require("./../urls");
const errorHandler_1 = require("./middleware/errorHandler");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const student_1 = require("./routes/student");
dotenv_1.default.config();
const port = process.env.PORT || 80;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
mongoose_1.default
    .connect(urls_1.Urls.MONDO_DB_CONNECTION_URL)
    .then(() => {
    logger_utils_1.Logger.info(`Connected to the database successfully.`);
})
    .catch((error) => {
    logger_utils_1.Logger.error(`Error connecting to the database: ${error}`);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
app.use("/", auth_1.userRouter);
app.use("/", student_1.studentRouter);
app.use("/", recruitment_1.recruitmentRouter);
app.use("/", mail_1.mailRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    (0, errorHandler_1.HandleError)(err, req, res, next);
});
