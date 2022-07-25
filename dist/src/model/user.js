"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please provide a valid email id"],
        minlength: [5, "Username should be of minimum 6 length"],
    },
    password: {
        type: String,
        required: [true, "Please provide a valid password"],
        minlength: [6, "Password should be of minimum 6 length"],
    },
});
exports.User = mongoose_1.default.model("User", userSchema);
