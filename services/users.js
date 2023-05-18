import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", "NotFound Error");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new CustomError("Invalid credentials", "Authentication Error");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    user: {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      id: user._id,
    },
    token,
  };
};

const register = async (userData) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const newUser = { ...userData, password: hashedPassword };
  await User.create(newUser);
  return {
    email: newUser.email,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
  };
};

export default { login, register };
