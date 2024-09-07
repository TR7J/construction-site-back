// imports
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import Tenant from "../models/Tenant";

// Sign in controller
export const signinUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        tenantId: user.tenantId, // Include tenantId
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Signup user controller
export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Check if the tenant already exists
    let tenant = await Tenant.findOne({ name: name });
    if (!tenant) {
      // Create a new tenant if it does not exist
      tenant = new Tenant({ name: name });
      await tenant.save();
    }

    // Determine if the user is an admin based on the role
    const isAdmin = role === "admin";

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the user with the tenant ID
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isAdmin,
      tenantId: tenant._id, // Associate user with tenant ID
    });

    // Generate token
    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      tenantId: user.tenantId,
      token,
    });
  } catch (error: any) {
    console.error("Error creating user:", error.message, error);
    res
      .status(500)
      .json({ message: "User creation failed", error: error.message });
  }
};

// Controller to create a supervisor
export const createSupervisor = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id; // Admin ID from the authenticated user
    const { name, email, password, role } = req.body; // Supervisor details

    if (!adminId) {
      return res.status(401).json({ message: "Admin not authenticated" });
    }

    // Find the admin to get their tenantId
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to create supervisor" });
    }

    // Determine if the user is an admin based on the role
    const isAdmin = role === "admin";

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the user with the tenant ID
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isAdmin,
      tenantId: admin.tenantId, // Associate user with tenant ID
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      tenantId: user.tenantId,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating supervisor", error });
  }
};

// Update profile controller
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        tenantId: updatedUser.tenantId,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get users - admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  get a user by ID - admin
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// update a user - admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in Updating User" });
  }
};

// delete a user - admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot Delete Admin User" });
    }

    await User.deleteOne({ _id: req.params.id });

    res.send({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error in Deleting User" });
  }
};

// get the current user's information
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in Fetching User" });
  }
};
