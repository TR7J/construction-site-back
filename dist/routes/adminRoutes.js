"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
// Material Type Routes
router.post("/material", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, adminController_1.addOrUpdateMaterial);
router.get("/materials", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, adminController_1.getMaterials);
// Tool Routes
router.post("/tools", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, adminController_1.addTool);
router.get("/tools", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, adminController_1.getTools);
// Worker Routes
router.get("/workers", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, adminController_1.getWorkers);
exports.default = router;
