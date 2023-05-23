import express from "express";
import http from "http";
import userRouter from "./routes/users.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import "./db.js";
import "./socket.js";

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

app.get("/", (req, res) => {
  res.send("works!");
});

app.use(userRouter);

app.use(errorHandler);

const PORT = process.env.port || 8000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
