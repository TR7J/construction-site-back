import express from "express";
import {
  addLabour,
  addOrUpdateMaterial,
  addWorker,
  deleteLabour,
  deleteMaterial,
  getLabourById,
  getLabours,
  getMaterialById,
  getMaterials,
  updateLabourById,
  updateMaterial,
} from "../controllers/supervisorController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Material management routes
router.post("/material/:projectId", AuthMiddleware, addOrUpdateMaterial);
// Worker management routes
router.post("/workers", AuthMiddleware, addWorker);

// Get all materials
router.get("/materials/:projectId", AuthMiddleware, getMaterials);
// Get a material by ID
router.get("/material/:id", AuthMiddleware, getMaterialById);
// Edit a material
router.put("/material/:id", AuthMiddleware, updateMaterial);
// Delete a material
router.delete("/material/:id", AuthMiddleware, deleteMaterial);
// Post Labour
router.post("/labour/:projectId", AuthMiddleware, addLabour);
// Get Labours
router.get("/labours/:projectId", AuthMiddleware, getLabours);
// Get Labour by id
router.get("/labour/:id", AuthMiddleware, getLabourById);
// Update Labours by id
router.put("/labour/:id", AuthMiddleware, updateLabourById);
// Delete Labours by id
router.delete("/labour/:id", AuthMiddleware, deleteLabour);

export default router;
