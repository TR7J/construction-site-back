import { Request, Response } from "express";
import Material from "../models/Material";
import User from "../models/User";
import Labour from "../models/Labour";

export const addOrUpdateMaterial = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const { projectId } = req.params;
    let { name, quantity, unitPrice, unitType, milestone } = req.body;

    quantity = Number(quantity);
    unitPrice = Number(unitPrice);
    const totalPrice = quantity * unitPrice;

    let material = await Material.findOne({ name, tenantId, projectId });

    if (material) {
      material.quantity += quantity;
      material.unitPrice = unitPrice;
      material.totalPrice = material.quantity * material.unitPrice;
      material.unitType = unitType;

      material.history.push({
        date: new Date(),
        name: material.name,
        quantity,
        unitPrice,
        totalPrice,
        unitType: material.unitType,
        milestone,
      });

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      const newMaterial = new Material({
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
      const createdMaterial = await newMaterial.save();
      res.status(201).json(createdMaterial);
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing material", error });
  }
};

// Get all materials for a project
export const getMaterialsByProject = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projectId = req.params.projectId;
    const materials = await Material.find({ tenantId, projectId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve materials", error });
  }
};

// Get all materials for the tenant
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projectId = req.params.projectId;
    const materials = await Material.find({ tenantId, projectId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve materials", error });
  }
};

// Get a single material by ID with tenant filtering
export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId; // Extract tenantId from the authenticated user

    const material = await Material.findOne({
      _id: req.params.id,
      tenantId, // Ensure the material belongs to the same tenant
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(material);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update material
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete material by ID with tenant-based access
export const deleteMaterial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user?.tenantId;

  try {
    const material = await Material.findOne({ _id: id, tenantId });

    if (!material) {
      return res
        .status(404)
        .json({ message: "Material not found or not authorized" });
    }

    await Material.findByIdAndDelete(id);
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting material", error: error.message });
  }
};

// Add Labour
export const addLabour = async (req: Request, res: Response) => {
  try {
    if (!req.body.date || !req.body.milestone || !req.body.labourType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const { projectId } = req.params;
    const { tenantId } = req.user;
    const newLabour = new Labour({
      ...req.body,
      tenantId, // Associate with the tenant
      projectId, // Associate with the project
    });
    await newLabour.save();
    res
      .status(201)
      .json({ message: "Labour added successfully", labour: newLabour });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to add labour", error: error.message });
  }
};

// Get all labours for the tenant
export const getLabours = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projectId = req.params.projectId;
    const labours = await Labour.find({ tenantId, projectId });
    res.status(200).json(labours);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch labours", error: error.message });
  }
};

// Get labour by ID with tenant filtering
export const getLabourById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId; // Extract tenantId from the authenticated user

    const labour = await Labour.findOne({
      _id: req.params.id,
      tenantId, // Ensure the labour entry belongs to the same tenant
    });

    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }

    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/// Update labour by ID
export const updateLabourById = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const labour = await Labour.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a labour entry by ID with tenant-based access
export const deleteLabour = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user?.tenantId; // Assuming req.user contains the tenant info

  try {
    const labour = await Labour.findOne({ _id: id, tenantId });

    if (!labour) {
      return res
        .status(404)
        .json({ message: "Labour not found or not authorized" });
    }

    await Labour.findByIdAndDelete(id);
    res.status(200).json({ message: "Labour deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting labour", error: error.message });
  }
};

// Add Worker
export const addWorker = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { tenantId } = req.user;
    const { name, mobile } = req.body;

    const worker = new User({
      name,
      mobile,
      role: "worker",
      tenantId, // Associate with the tenant
      projectId, // Associate with the project
    });

    const createdWorker = await worker.save();
    res.status(201).json(createdWorker);
  } catch (error) {
    res.status(500).json({ message: "Error adding worker", error });
  }
};

// Get all workers for a project
export const getWorkersByProject = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projectId = req.params.projectId;
    const workers = await User.find({ role: "worker", tenantId, projectId });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers", error });
  }
};

// Update worker by ID
export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const { workerId } = req.params;

    const worker = await User.findOneAndUpdate(
      { _id: workerId, tenantId },
      req.body,
      { new: true }
    );
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: "Error updating worker", error });
  }
};

// Delete a worker by ID with tenant-based access
export const deleteWorker = async (req: Request, res: Response) => {
  const { workerId } = req.params;
  const tenantId = req.user?.tenantId;

  try {
    const worker = await User.findOne({ _id: workerId, tenantId });

    if (!worker) {
      return res
        .status(404)
        .json({ message: "Worker not found or not authorized" });
    }

    await User.findByIdAndDelete(workerId);
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting worker", error: error.message });
  }
};

// Get all workers for the tenant
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const projectId = req.params.projectId;
    const workers = await User.find({ role: "worker", tenantId, projectId });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers", error });
  }
};
