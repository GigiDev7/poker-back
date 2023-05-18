import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [isEmail, "Provide valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstname: {
      type: String,
      required: [true, "First name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
