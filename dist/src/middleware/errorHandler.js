"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleError = exports.CreateError = void 0;
const constants_1 = require("./../../constants");
class CreateError extends Error {
    constructor(status, serverMessage, clientMessage) {
        super(serverMessage);
        this.status = status;
        this.clientMessage = clientMessage;
        this.serverMessage = serverMessage;
    }
    static NoContent(serverMessage, clientMessage) {
        return new CreateError(204, serverMessage, clientMessage);
    }
    static BadRequest(serverMessage, clientMessage) {
        return new CreateError(400, serverMessage, clientMessage || "Bad Request");
    }
    static Unauthorized(serverMessage, clientMessage) {
        return new CreateError(401, serverMessage, clientMessage || "Unauthorized");
    }
    static Forbidden(serverMessage, clientMessage) {
        return new CreateError(403, serverMessage, clientMessage || "Forbidden");
    }
    static NotFound(serverMessage, clientMessage) {
        return new CreateError(404, serverMessage, clientMessage || "Not Found");
    }
    static Conflict(serverMessage, clientMessage) {
        return new CreateError(409, serverMessage, clientMessage || "Conflict");
    }
    static MethodNotAllowed(serverMessage, clientMessage) {
        return new CreateError(405, serverMessage, clientMessage || "Method Not Allowed");
    }
    static TooManyRequests(serverMessage, clientMessage) {
        return new CreateError(429, serverMessage, clientMessage || "Too Many Requests");
    }
    static InternalServerError(serverMessage, clientMessage) {
        return new CreateError(500, serverMessage, clientMessage || "Internal Server Error");
    }
}
exports.CreateError = CreateError;
const HandleError = (error, _req, res) => {
    const status = error.status || 500;
    const clientMessage = error.clientMessage || "Something went wrong";
    const serverMessage = error.serverMessage || "Something went wrong";
    res.status(status).json({
        status: constants_1.globalConstants.status.FAILED,
        clientMessage,
        serverMessage,
    });
};
exports.HandleError = HandleError;
