import express from "express";
import {
  addTool,
  getTools,
  getWorkers,
  addOrUpdateMaterial,
  getMaterials,
} from "../controllers/adminController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AdminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

// Material Type Routes
router.post("/material", AuthMiddleware, AdminMiddleware, addOrUpdateMaterial);
router.get("/materials", AuthMiddleware, AdminMiddleware, getMaterials);

// Tool Routes
router.post("/tools", AuthMiddleware, AdminMiddleware, addTool);
router.get("/tools", AuthMiddleware, AdminMiddleware, getTools);

// Worker Routes
router.get("/workers", AuthMiddleware, AdminMiddleware, getWorkers);

export default router;
