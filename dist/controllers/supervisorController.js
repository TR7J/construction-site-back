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
exports.getAllWorkers = exports.deleteWorker = exports.updateWorker = exports.getWorkersByProject = exports.addWorker = exports.deleteLabour = exports.updateLabourById = exports.getLabourById = exports.getLabours = exports.addLabour = exports.deleteMaterial = exports.updateMaterial = exports.getMaterialById = exports.getMaterials = exports.getMaterialsByProject = exports.addOrUpdateMaterial = void 0;
const Material_1 = __importDefault(require("../models/Material"));
const User_1 = __importDefault(require("../models/User"));
const Labour_1 = __importDefault(require("../models/Labour"));
const addOrUpdateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const { projectId } = req.params;
        let { name, quantity, unitPrice, unitType, milestone } = req.body;
        quantity = Number(quantity);
        unitPrice = Number(unitPrice);
        const totalPrice = quantity * unitPrice;
        // Create a new material entry every time, regardless of existing materials
        const newMaterial = new Material_1.default({
            name,
            quantity,
            unitPrice,
            totalPrice,
            unitType,
            milestone,
            tenantId, // Associate with the tenant
            projectId, // Associate with the project
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
        return res.status(201).json(createdMaterial);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res
            .status(500)
            .json({ message: "Error processing material", error });
    }
});
exports.addOrUpdateMaterial = addOrUpdateMaterial;
// Get all materials for a project
const getMaterialsByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projectId = req.params.projectId;
        const materials = yield Material_1.default.find({ tenantId, projectId });
        res.json(materials);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve materials", error });
    }
});
exports.getMaterialsByProject = getMaterialsByProject;
// Get all materials for the tenant
const getMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projectId = req.params.projectId;
        const materials = yield Material_1.default.find({ tenantId, projectId });
        res.json(materials);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve materials", error });
    }
});
exports.getMaterials = getMaterials;
// Get a single material by ID with tenant filtering
const getMaterialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId; // Extract tenantId from the authenticated user
        const material = yield Material_1.default.findOne({
            _id: req.params.id,
            tenantId, // Ensure the material belongs to the same tenant
        });
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.json(material);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getMaterialById = getMaterialById;
// Update material
const updateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const material = yield Material_1.default.findOneAndUpdate({ _id: req.params.id, tenantId }, req.body, { new: true, runValidators: true });
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.json(material);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateMaterial = updateMaterial;
// Delete material by ID with tenant-based access
const deleteMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId;
    try {
        const material = yield Material_1.default.findOne({ _id: id, tenantId });
        if (!material) {
            return res
                .status(404)
                .json({ message: "Material not found or not authorized" });
        }
        yield Material_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Material deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting material", error: error.message });
    }
});
exports.deleteMaterial = deleteMaterial;
// Add Labour
const addLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.date || !req.body.milestone || !req.body.labourType) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const { projectId } = req.params;
        const { tenantId } = req.user;
        const newLabour = new Labour_1.default(Object.assign(Object.assign({}, req.body), { tenantId, // Associate with the tenant
            projectId }));
        yield newLabour.save();
        res
            .status(201)
            .json({ message: "Labour added successfully", labour: newLabour });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to add labour", error: error.message });
    }
});
exports.addLabour = addLabour;
// Get all labours for the tenant
const getLabours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projectId = req.params.projectId;
        const labours = yield Labour_1.default.find({ tenantId, projectId });
        res.status(200).json(labours);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch labours", error: error.message });
    }
});
exports.getLabours = getLabours;
// Get labour by ID with tenant filtering
const getLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId; // Extract tenantId from the authenticated user
        const labour = yield Labour_1.default.findOne({
            _id: req.params.id,
            tenantId, // Ensure the labour entry belongs to the same tenant
        });
        if (!labour) {
            return res.status(404).json({ message: "Labour not found" });
        }
        res.json(labour);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getLabourById = getLabourById;
/// Update labour by ID
const updateLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const labour = yield Labour_1.default.findOneAndUpdate({ _id: req.params.id, tenantId }, req.body, { new: true, runValidators: true });
        if (!labour) {
            return res.status(404).json({ message: "Labour not found" });
        }
        res.json(labour);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateLabourById = updateLabourById;
// Delete a labour entry by ID with tenant-based access
const deleteLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId; // Assuming req.user contains the tenant info
    try {
        const labour = yield Labour_1.default.findOne({ _id: id, tenantId });
        if (!labour) {
            return res
                .status(404)
                .json({ message: "Labour not found or not authorized" });
        }
        yield Labour_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Labour deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting labour", error: error.message });
    }
});
exports.deleteLabour = deleteLabour;
// Add Worker
const addWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { tenantId } = req.user;
        const { name, mobile } = req.body;
        const worker = new User_1.default({
            name,
            mobile,
            role: "worker",
            tenantId, // Associate with the tenant
            projectId, // Associate with the project
        });
        const createdWorker = yield worker.save();
        res.status(201).json(createdWorker);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding worker", error });
    }
});
exports.addWorker = addWorker;
// Get all workers for a project
const getWorkersByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projectId = req.params.projectId;
        const workers = yield User_1.default.find({ role: "worker", tenantId, projectId });
        res.json(workers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching workers", error });
    }
});
exports.getWorkersByProject = getWorkersByProject;
// Update worker by ID
const updateWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const { workerId } = req.params;
        const worker = yield User_1.default.findOneAndUpdate({ _id: workerId, tenantId }, req.body, { new: true });
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        res.json(worker);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating worker", error });
    }
});
exports.updateWorker = updateWorker;
// Delete a worker by ID with tenant-based access
const deleteWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workerId } = req.params;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId;
    try {
        const worker = yield User_1.default.findOne({ _id: workerId, tenantId });
        if (!worker) {
            return res
                .status(404)
                .json({ message: "Worker not found or not authorized" });
        }
        yield User_1.default.findByIdAndDelete(workerId);
        res.status(200).json({ message: "Worker deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting worker", error: error.message });
    }
});
exports.deleteWorker = deleteWorker;
// Get all workers for the tenant
const getAllWorkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projectId = req.params.projectId;
        const workers = yield User_1.default.find({ role: "worker", tenantId, projectId });
        res.json(workers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching workers", error });
    }
});
exports.getAllWorkers = getAllWorkers;
