import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to db");
} catch (error) {
  console.log(error);
  console.log("Error connecting to db");
}
