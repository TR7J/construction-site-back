import express from "express";
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AdminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/", AuthMiddleware, AdminMiddleware, addProject);
router.get("/", AuthMiddleware, AdminMiddleware, getProjects);
router.get("/:project_id", AuthMiddleware, AdminMiddleware, getProjectById);
router.put("/:id", AuthMiddleware, AdminMiddleware, updateProject);
router.delete("/:id", AuthMiddleware, AdminMiddleware, deleteProject);

export default router;
