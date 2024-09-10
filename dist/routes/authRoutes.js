"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/register", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, authController_1.signupUser);
router.post("/createSupervisor", authMiddleware_1.AuthMiddleware, adminMiddleware_1.AdminMiddleware, authController_1.createSupervisor);
router.post("/login", authController_1.signinUser);
exports.default = router;
