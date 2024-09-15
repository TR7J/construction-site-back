import { Request, Response } from "express";
import Project from "../models/Project";

// Add a new project
export const addProject = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const { name, description, startDate, endDate } = req.body;

    const newProject = new Project({
      name,
      description,
      tenantId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const createdProject = await newProject.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: "Error adding project", error });
  }
};

// Get all projects for the tenant
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projects = await Project.find({ tenantId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects", error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.project_id;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.user?.tenantId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving project", error });
  }
};
// Update project by ID
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};

// Delete a project by ID
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user?.tenantId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
