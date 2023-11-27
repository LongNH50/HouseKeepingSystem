//1. import dependencies
import express, { json } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import * as url from "url";
import fs from "fs";
import cors from "cors";
import userRouter from "./routers/usersRouter.js";
import adminRouter from "./routers/adminRouter.js";
import houseKeeperRouter from "./routers/houseKeepersRouter.js";
import dotenv from "dotenv";

const LOG_FILE = "access.log";

//2. init
const app = express();
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION);
console.log("Connected to MongoDB HouseKeeperApplication");

//3. app configuration
app.set("x-powered-by", false);

//4.middleware
// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_URL,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const logStream = fs.createWriteStream(
  path.join(url.fileURLToPath(new URL(".", import.meta.url)), LOG_FILE),
  {
    flags: "a",
  }
);
app.use(morgan("dev", { stream: logStream }));
app.use(json());

//5. routes
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/houseKeepers", houseKeeperRouter);

app.all("*", (req, res, next) => {
  next(new Error("Route not found"));
});

//6. error handlers
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

//7. bootstrap
app.listen(3000, () => {
  console.log("Application started on port 3000");
});
