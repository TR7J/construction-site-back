import { Request, Response } from "express";
import MaterialType from "../models/MaterialType";
import Tool from "../models/Tool";
import User from "../models/User";
import Material from "../models/Material";

export const addOrUpdateMaterial = async (req: Request, res: Response) => {
  try {
    let { name, quantity, unitPrice, unitType, milestone } = req.body;

    // Ensure quantity and unitPrice are treated as numbers
    quantity = Number(quantity);
    unitPrice = Number(unitPrice);
    const totalPrice = quantity * unitPrice;

    // Check if the material already exists by name
    let material = await Material.findOne({ name });

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

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      // Create new material
      const newMaterial = new Material({
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
      const createdMaterial = await newMaterial.save();
      res.status(201).json(createdMaterial);
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing material", error });
  }
};
// Get all materials
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await Material.find();
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

// Get all workers added by the supervisor
export const getWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await User.find({ role: "supervisor" });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers", error });
  }
};
