import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const User = mongoose.model("User", userSchema);
