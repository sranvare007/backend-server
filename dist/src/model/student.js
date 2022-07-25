"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a valid firstName for student."],
    },
    middleName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: [true, "Please provide a valid lastName for student."],
    },
    registrationId: {
        type: Number,
        default: 0,
        required: [true, "Please provide a valid registrationId for the user."],
    },
    course: {
        type: String,
        required: [true, "Please provide a valid course name."],
    },
    admissionYear: {
        type: Number,
        required: [true, "Please provide a valid admissionYear"],
    },
    emailId: {
        type: String,
        required: [true, "Please provide a valid emailId."],
    },
    phoneNumber: {
        type: String,
        required: [true, "Please provide a valid phoneNumber."],
    },
    averageCGPA: {
        type: Number,
        required: [true, "Please provide a valid averageCGPA."],
    },
    photoUrl: {
        type: String,
        required: [true, "Please provide a valid photoUrl."],
    },
});
exports.Student = mongoose_1.default.model("Student", studentSchema);
