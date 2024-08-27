"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supervisorController_1 = require("../controllers/supervisorController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Material management routes
router.post("/material", authMiddleware_1.AuthMiddleware, supervisorController_1.addOrUpdateMaterial);
// Worker management routes
router.post("/workers", authMiddleware_1.AuthMiddleware, supervisorController_1.addWorker);
// Issue materials route
router.post("/issue-materials/:round", authMiddleware_1.AuthMiddleware, supervisorController_1.issueMaterials);
// Get all materials
router.get("/materials", authMiddleware_1.AuthMiddleware, supervisorController_1.getMaterials);
// Get a material by ID
router.get("/material/:id", supervisorController_1.getMaterialById);
// Edit a material
router.put("/material/:id", supervisorController_1.updateMaterial);
// Delete a material
router.delete("/material/:id", supervisorController_1.deleteMaterial);
// Post Labour
router.post("/labour", supervisorController_1.addLabour);
// Get Labours
router.get("/labours", supervisorController_1.getLabours);
// Get Labour by id
router.get("/labour/:id", supervisorController_1.getLabourById);
// Update Labours by id
router.put("/labour/:id", supervisorController_1.updateLabourById);
// Delete Labours by id
router.delete("/labour/:id", supervisorController_1.deleteLabour);
// Get issued materials for a worker
router.get("/issued-materials/:workerId", authMiddleware_1.AuthMiddleware, supervisorController_1.getWorkerMaterialIssuances);
// Get all issued materials
router.get("/issued-materials", authMiddleware_1.AuthMiddleware, supervisorController_1.getAllMaterialIssuances);
// pay workers based on attendance
router.post("/payments", authMiddleware_1.AuthMiddleware, supervisorController_1.createPayment);
// Record remaining materials
router.post("/remaining-materials", authMiddleware_1.AuthMiddleware, supervisorController_1.recordRemainingMaterials);
// Get remaining materials
router.get("/remaining-materials", authMiddleware_1.AuthMiddleware, supervisorController_1.getRemainingMaterials);
exports.default = router;
