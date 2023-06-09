import express from "express";
import http from "http";
import userRouter from "./routes/users.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import "./db.js";

const app = express();
const server = http.createServer(app);

dotenv.config();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://react-wsop.netlify.app"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(userRouter);

app.use(errorHandler);

export default server;
