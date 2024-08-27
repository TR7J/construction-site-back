import { Request, Response } from "express";
import Material from "../models/Material";
import User from "../models/User";
import Labour from "../models/Labour";
import IssuedMaterial from "../models/MaterialIssuance";
import Payment from "../models/Payment";
import Attendance from "../models/Attendance";
import MaterialIssuance from "../models/MaterialIssuance";
import RemainingMaterials from "../models/RemainingMaterials";

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

// Get a single material by ID
export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
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
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete material
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addLabour = async (req: Request, res: Response) => {
  try {
    if (!req.body.date || !req.body.milestone || !req.body.labourType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newLabour = new Labour(req.body);
    await newLabour.save();
    res
      .status(201)
      .json({ message: "Labour added successfully", labour: newLabour });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to add labour", error: error.message });
  }
};
// Get Labours
export const getLabours = async (req: Request, res: Response) => {
  try {
    const labours = await Labour.find();
    res.status(200).json(labours);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch labours", error: error.message });
  }
};

// Get labour by ID
export const getLabourById = async (req: Request, res: Response) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update labour by ID
export const updateLabourById = async (req: Request, res: Response) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a labour entry by ID
export const deleteLabour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const labour = await Labour.findByIdAndDelete(id);

    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }

    res.status(200).json({ message: "Labour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new worker
export const addWorker = async (req: Request, res: Response) => {
  try {
    const { name, mobile } = req.body;

    // Create a new worker
    const worker = new User({
      name,
      mobile,
      role: "worker",
    });

    // Save the new worker
    const createdWorker = await worker.save();
    res.status(201).json(createdWorker);
  } catch (error) {
    res.status(500).json({ message: "Error adding worker", error });
  }
};

// Issue materials to a worker
export const issueMaterials = async (req: Request, res: Response) => {
  try {
    const { workerId, materialId, quantity } = req.body;
    const { round } = req.params;

    // Find the worker
    const worker = await User.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Find the material
    const material = await Material.findById(materialId);
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
    await material.save();

    // Record the issuance
    const issuance = new MaterialIssuance({
      workerId,
      materialId,
      quantity,
      round,
    });
    const createdIssuance = await issuance.save();

    return res.status(201).json(createdIssuance);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all issued materials for a specific worker
export const getWorkerMaterialIssuances = async (
  req: Request,
  res: Response
) => {
  try {
    const { workerId } = req.params;

    // Find all issuances for the specific worker and populate related fields
    const issuances = await MaterialIssuance.find({ workerId })
      .populate("materialId", "name")
      .populate("workerId", "name");

    return res.json(issuances);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all issued materials
export const getAllMaterialIssuances = async (req: Request, res: Response) => {
  try {
    // Find all material issuances and populate related fields
    const issuances = await MaterialIssuance.find()
      .populate("materialId", "name")
      .populate("workerId", "name");

    return res.json(issuances);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
//pay workers
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { workerId, amountPerDay, startDate, endDate, description } =
      req.body;

    // Find the worker by ID
    const worker = await User.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Find attendance records within the date range
    const attendanceRecords = await Attendance.find({
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
    const payment = new Payment({
      workerId,
      amount: totalPayment,
      description,
      date: new Date(),
    });

    const createdPayment = await payment.save();
    return res.status(201).json(createdPayment);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Record remaining materials
export const recordRemainingMaterials = async (req: Request, res: Response) => {
  try {
    const { materialId, quantity } = req.body;

    // Find the material
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Create a record of remaining materials
    const remainingMaterial = new RemainingMaterials({
      materialId,
      quantity,
      date: new Date(),
    });

    const createdRemainingMaterial = await remainingMaterial.save();
    return res.status(201).json(createdRemainingMaterial);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all remaining materials
export const getRemainingMaterials = async (req: Request, res: Response) => {
  try {
    const remainingMaterials = await RemainingMaterials.find().populate(
      "materialId",
      "name"
    );
    res.json(remainingMaterials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Mark attendance for a worker
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { workerId, status } = req.body;
    const { date } = req.params; // Assuming date is passed in params

    const existingAttendance = await Attendance.findOne({ workerId, date });

    if (existingAttendance) {
      existingAttendance.status = status;
      const updatedAttendance = await existingAttendance.save();
      return res.json(updatedAttendance);
    } else {
      const newAttendance = new Attendance({
        workerId,
        date,
        status,
      });
      const createdAttendance = await newAttendance.save();
      return res.status(201).json(createdAttendance);
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Update worker details
export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;
    const updates = req.body;

    const worker = await User.findByIdAndUpdate(workerId, updates, {
      new: true,
    });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: "Error updating worker", error });
  }
};

// Delete a worker
export const deleteWorker = async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;

    const worker = await User.findByIdAndDelete(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting worker", error });
  }
};

// Get all workers
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await User.find({ role: "worker" });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers", error });
  }
};

// Get attendance for a specific worker
export const getWorkerAttendance = async (req: Request, res: Response) => {
  try {
    const { workerId } = req.params;
    const { startDate, endDate } = req.query; // assuming dates are passed as query params

    const attendance = await Attendance.find({
      workerId,
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};
