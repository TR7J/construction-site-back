"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkers = exports.getTools = exports.addTool = exports.getMaterials = exports.addOrUpdateMaterial = void 0;
const Tool_1 = __importDefault(require("../models/Tool"));
const User_1 = __importDefault(require("../models/User"));
const Material_1 = __importDefault(require("../models/Material"));
const addOrUpdateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, quantity, unitPrice, unitType, milestone } = req.body;
        // Ensure quantity and unitPrice are treated as numbers
        quantity = Number(quantity);
        unitPrice = Number(unitPrice);
        const totalPrice = quantity * unitPrice;
        // Check if the material already exists by name
        let material = yield Material_1.default.findOne({ name });
        if (material) {
            // Update existing material
            material.quantity += quantity;
            material.unitPrice = unitPrice;
            material.totalPrice = material.quantity * material.unitPrice; // Recalculate total price
            material.unitType = unitType;
            // Add to history
            material.history.push({
                date: new Date(),
                name: material.name,
                quantity,
                unitPrice,
                totalPrice,
                unitType: material.unitType,
                milestone,
            });
            const updatedMaterial = yield material.save();
            res.json(updatedMaterial);
        }
        else {
            // Create new material
            const newMaterial = new Material_1.default({
                name,
                quantity,
                unitPrice,
                totalPrice,
                unitType,
                milestone,
                history: [
                    {
                        date: new Date(),
                        name,
                        quantity,
                        unitPrice,
                        totalPrice,
                        unitType,
                        milestone,
                    },
                ],
            });
            const createdMaterial = yield newMaterial.save();
            res.status(201).json(createdMaterial);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error processing material", error });
    }
});
exports.addOrUpdateMaterial = addOrUpdateMaterial;
// Get all materials
const getMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const materials = yield Material_1.default.find();
        res.json(materials);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve materials", error });
    }
});
exports.getMaterials = getMaterials;
// Add a new tool
const addTool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, quantity } = req.body;
        const toolExists = yield Tool_1.default.findOne({ name });
        if (toolExists) {
            res.status(400).json({ message: "Tool already exists" });
            return;
        }
        const tool = new Tool_1.default({ name, description, quantity });
        const createdTool = yield tool.save();
        res.status(201).json(createdTool);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding tool", error });
    }
});
exports.addTool = addTool;
// Get all tools
const getTools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tools = yield Tool_1.default.find({});
        res.json(tools);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching tools", error });
    }
});
exports.getTools = getTools;
// Get all workers added by the supervisor
const getWorkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workers = yield User_1.default.find({ role: "supervisor" });
        res.json(workers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching workers", error });
    }
});
exports.getWorkers = getWorkers;
