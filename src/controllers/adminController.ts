import { Request, Response } from "express";
import Tool from "../models/Tool";
import User from "../models/User";
import Material from "../models/Material";

export const addOrUpdateMaterial = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    let { name, quantity, unitPrice, unitType, milestone } = req.body;

    quantity = Number(quantity);
    unitPrice = Number(unitPrice);
    const totalPrice = quantity * unitPrice;

    let material = await Material.findOne({ name, tenantId });

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

// Get all materials for the tenant
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const materials = await Material.find({ tenantId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve materials", error });
  }
};
// Add a new tool
export const addTool = async (req: Request, res: Response) => {
  try {
    const { name, description, quantity } = req.body;

    const toolExists = await Tool.findOne({ name });

    if (toolExists) {
      res.status(400).json({ message: "Tool already exists" });
      return;
    }

    const tool = new Tool({ name, description, quantity });
    const createdTool = await tool.save();

    res.status(201).json(createdTool);
  } catch (error) {
    res.status(500).json({ message: "Error adding tool", error });
  }
};

// Get all tools
export const getTools = async (req: Request, res: Response) => {
  try {
    const tools = await Tool.find({});
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tools", error });
  }
};

// Get all workers for the tenant
export const getWorkers = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const workers = await User.find({ role: "worker", tenantId });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers", error });
  }
};
