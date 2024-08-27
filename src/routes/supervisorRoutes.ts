import express from "express";
import {
  addLabour,
  addOrUpdateMaterial,
  addWorker,
  createPayment,
  deleteLabour,
  deleteMaterial,
  getAllMaterialIssuances,
  getLabourById,
  getLabours,
  getMaterialById,
  getMaterials,
  getRemainingMaterials,
  getWorkerMaterialIssuances,
  issueMaterials,
  recordRemainingMaterials,
  updateLabourById,
  updateMaterial,
} from "../controllers/supervisorController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Material management routes
router.post("/material", AuthMiddleware, addOrUpdateMaterial);
// Worker management routes
router.post("/workers", AuthMiddleware, addWorker);
// Issue materials route
router.post("/issue-materials/:round", AuthMiddleware, issueMaterials);
// Get all materials
router.get("/materials", AuthMiddleware, getMaterials);
// Get a material by ID
router.get("/material/:id", getMaterialById);
// Edit a material
router.put("/material/:id", updateMaterial);
// Delete a material
router.delete("/material/:id", deleteMaterial);
// Post Labour
router.post("/labour", addLabour);
// Get Labours
router.get("/labours", getLabours);
// Get Labour by id
router.get("/labour/:id", getLabourById);
// Update Labours by id
router.put("/labour/:id", updateLabourById);
// Delete Labours by id
router.delete("/labour/:id", deleteLabour);

// Get issued materials for a worker
router.get(
  "/issued-materials/:workerId",
  AuthMiddleware,
  getWorkerMaterialIssuances
);

// Get all issued materials
router.get("/issued-materials", AuthMiddleware, getAllMaterialIssuances);
// pay workers based on attendance
router.post("/payments", AuthMiddleware, createPayment);

// Record remaining materials
router.post("/remaining-materials", AuthMiddleware, recordRemainingMaterials);

// Get remaining materials
router.get("/remaining-materials", AuthMiddleware, getRemainingMaterials);

export default router;
