import express from "express";
import {
  signupUser,
  signinUser,
  createSupervisor,
} from "../controllers/authController";
import { AdminMiddleware } from "../middleware/adminMiddleware";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", AuthMiddleware, AdminMiddleware, signupUser);
router.post(
  "/createSupervisor",
  AuthMiddleware,
  AdminMiddleware,
  createSupervisor
);
router.post("/login", signinUser);

export default router;
