"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = require("winston");
const isDev = process.env.NODE_ENV !== "production";
const consoleTransport = new winston_1.transports.Console({
    format: winston_1.format.simple(),
});
exports.Logger = (0, winston_1.createLogger)({
    level: isDev ? "debug" : "info",
    exitOnError: false,
    handleExceptions: true,
    transports: consoleTransport,
});
