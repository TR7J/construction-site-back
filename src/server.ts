// imports
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import supervisorRoutes from "./routes/supervisorRoutes";
import projectRoutes from "./routes/projectRoutes";

// fetching env variables
dotenv.config();

// initialise our app
const app: Express = express();

// connecting to mongodb
mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(() => {
    console.log("Error while connecting to database.");
  });

// cors middleware
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    // "https://construction-site-frontend.onrender.com"
  })
);

// middleware for parsing json data
app.use(express.json());

// middleware for our routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/projects", projectRoutes);

// listening ...
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
