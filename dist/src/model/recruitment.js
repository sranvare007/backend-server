"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recruitment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recruitmentSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        default: 0,
    },
    companyName: {
        type: String,
        required: [true, "Please provide a valid companyName."],
    },
    rolesHiring: {
        type: [String],
        required: [true, "Please provide valid recruitment roles."],
    },
    eligibilityCriteria: {
        type: String,
        required: [true, "Please provide a valid eligibility criteria."],
    },
    ctcProvided: {
        type: Number,
        required: [true, "Please provide a valid ctcProvided."],
    },
    minCGPA: {
        type: Number,
        required: [true, "Please provide a valid minCGPA."],
    },
});
exports.Recruitment = mongoose_1.default.model("Recruitment", recruitmentSchema);
