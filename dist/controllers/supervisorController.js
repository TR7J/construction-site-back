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
exports.getWorkerAttendance = exports.getAllWorkers = exports.deleteWorker = exports.updateWorker = exports.markAttendance = exports.getRemainingMaterials = exports.recordRemainingMaterials = exports.createPayment = exports.getAllMaterialIssuances = exports.getWorkerMaterialIssuances = exports.issueMaterials = exports.addWorker = exports.deleteLabour = exports.updateLabourById = exports.getLabourById = exports.getLabours = exports.addLabour = exports.deleteMaterial = exports.updateMaterial = exports.getMaterialById = exports.getMaterials = exports.addOrUpdateMaterial = void 0;
const Material_1 = __importDefault(require("../models/Material"));
const User_1 = __importDefault(require("../models/User"));
const Labour_1 = __importDefault(require("../models/Labour"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const MaterialIssuance_1 = __importDefault(require("../models/MaterialIssuance"));
const RemainingMaterials_1 = __importDefault(require("../models/RemainingMaterials"));
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
// Get a single material by ID
const getMaterialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const material = yield Material_1.default.findById(req.params.id);
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
        const material = yield Material_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
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
exports.updateMaterial = updateMaterial;
// Delete material
const deleteMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const material = yield Material_1.default.findByIdAndDelete(req.params.id);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.json({ message: "Material deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteMaterial = deleteMaterial;
const addLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.date || !req.body.milestone || !req.body.labourType) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newLabour = new Labour_1.default(req.body);
        yield newLabour.save();
        res
            .status(201)
            .json({ message: "Labour added successfully", labour: newLabour });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Failed to add labour", error: error.message });
    }
});
exports.addLabour = addLabour;
// Get Labours
const getLabours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labours = yield Labour_1.default.find();
        res.status(200).json(labours);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch labours", error: error.message });
    }
});
exports.getLabours = getLabours;
// Get labour by ID
const getLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labour = yield Labour_1.default.findById(req.params.id);
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
// Update labour by ID
const updateLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labour = yield Labour_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
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
exports.updateLabourById = updateLabourById;
// Delete a labour entry by ID
const deleteLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const labour = yield Labour_1.default.findByIdAndDelete(id);
        if (!labour) {
            return res.status(404).json({ message: "Labour not found" });
        }
        res.status(200).json({ message: "Labour deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteLabour = deleteLabour;
// Add a new worker
const addWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, mobile } = req.body;
        // Create a new worker
        const worker = new User_1.default({
            name,
            mobile,
            role: "worker",
        });
        // Save the new worker
        const createdWorker = yield worker.save();
        res.status(201).json(createdWorker);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding worker", error });
    }
});
exports.addWorker = addWorker;
// Issue materials to a worker
const issueMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId, materialId, quantity } = req.body;
        const { round } = req.params;
        // Find the worker
        const worker = yield User_1.default.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        // Find the material
        const material = yield Material_1.default.findById(materialId);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        // Check if sufficient quantity is available
        if (material.quantity < quantity) {
            return res
                .status(400)
                .json({ message: "Insufficient material quantity" });
        }
        // Update the material quantity
        material.quantity -= quantity;
        yield material.save();
        // Record the issuance
        const issuance = new MaterialIssuance_1.default({
            workerId,
            materialId,
            quantity,
            round,
        });
        const createdIssuance = yield issuance.save();
        return res.status(201).json(createdIssuance);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.issueMaterials = issueMaterials;
// Get all issued materials for a specific worker
const getWorkerMaterialIssuances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId } = req.params;
        // Find all issuances for the specific worker and populate related fields
        const issuances = yield MaterialIssuance_1.default.find({ workerId })
            .populate("materialId", "name")
            .populate("workerId", "name");
        return res.json(issuances);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getWorkerMaterialIssuances = getWorkerMaterialIssuances;
// Get all issued materials
const getAllMaterialIssuances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all material issuances and populate related fields
        const issuances = yield MaterialIssuance_1.default.find()
            .populate("materialId", "name")
            .populate("workerId", "name");
        return res.json(issuances);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllMaterialIssuances = getAllMaterialIssuances;
//pay workers
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId, amountPerDay, startDate, endDate, description } = req.body;
        // Find the worker by ID
        const worker = yield User_1.default.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        // Find attendance records within the date range
        const attendanceRecords = yield Attendance_1.default.find({
            workerId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
            status: "Present",
        });
        // Calculate the total payment based on the number of days present
        const totalDaysPresent = attendanceRecords.length;
        const totalPayment = totalDaysPresent * amountPerDay;
        // Create and save the payment
        const payment = new Payment_1.default({
            workerId,
            amount: totalPayment,
            description,
            date: new Date(),
        });
        const createdPayment = yield payment.save();
        return res.status(201).json(createdPayment);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
});
exports.createPayment = createPayment;
// Record remaining materials
const recordRemainingMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { materialId, quantity } = req.body;
        // Find the material
        const material = yield Material_1.default.findById(materialId);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        // Create a record of remaining materials
        const remainingMaterial = new RemainingMaterials_1.default({
            materialId,
            quantity,
            date: new Date(),
        });
        const createdRemainingMaterial = yield remainingMaterial.save();
        return res.status(201).json(createdRemainingMaterial);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.recordRemainingMaterials = recordRemainingMaterials;
// Get all remaining materials
const getRemainingMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const remainingMaterials = yield RemainingMaterials_1.default.find().populate("materialId", "name");
        res.json(remainingMaterials);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getRemainingMaterials = getRemainingMaterials;
// Mark attendance for a worker
const markAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId, status } = req.body;
        const { date } = req.params; // Assuming date is passed in params
        const existingAttendance = yield Attendance_1.default.findOne({ workerId, date });
        if (existingAttendance) {
            existingAttendance.status = status;
            const updatedAttendance = yield existingAttendance.save();
            return res.json(updatedAttendance);
        }
        else {
            const newAttendance = new Attendance_1.default({
                workerId,
                date,
                status,
            });
            const createdAttendance = yield newAttendance.save();
            return res.status(201).json(createdAttendance);
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
});
exports.markAttendance = markAttendance;
// Update worker details
const updateWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId } = req.params;
        const updates = req.body;
        const worker = yield User_1.default.findByIdAndUpdate(workerId, updates, {
            new: true,
        });
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
// Delete a worker
const deleteWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId } = req.params;
        const worker = yield User_1.default.findByIdAndDelete(workerId);
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        res.json({ message: "Worker deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting worker", error });
    }
});
exports.deleteWorker = deleteWorker;
// Get all workers
const getAllWorkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workers = yield User_1.default.find({ role: "worker" });
        res.json(workers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching workers", error });
    }
});
exports.getAllWorkers = getAllWorkers;
// Get attendance for a specific worker
const getWorkerAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workerId } = req.params;
        const { startDate, endDate } = req.query; // assuming dates are passed as query params
        const attendance = yield Attendance_1.default.find({
            workerId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error });
    }
});
exports.getWorkerAttendance = getWorkerAttendance;
