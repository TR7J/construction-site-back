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
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.addProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
// Add a new project
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const { name, description, startDate, endDate } = req.body;
        const newProject = new Project_1.default({
            name,
            description,
            tenantId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
        const createdProject = yield newProject.save();
        res.status(201).json(createdProject);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding project", error });
    }
});
exports.addProject = addProject;
// Get all projects for the tenant
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const projects = yield Project_1.default.find({ tenantId });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve projects", error });
    }
});
exports.getProjects = getProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const projectId = req.params.project_id;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        const project = yield Project_1.default.findOne({
            _id: projectId,
            tenantId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving project", error });
    }
});
exports.getProjectById = getProjectById;
// Update project by ID
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.user;
        const project = yield Project_1.default.findOneAndUpdate({ _id: req.params.id, tenantId }, Object.assign(Object.assign({}, req.body), { startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) }), { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
});
exports.updateProject = updateProject;
// Delete a project by ID
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const project = yield Project_1.default.findOneAndDelete({
            _id: req.params.id,
            tenantId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.tenantId,
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
});
exports.deleteProject = deleteProject;
