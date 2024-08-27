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
exports.getCurrentUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.updateUserProfile = exports.signupUser = exports.signinUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
// Sign in controller
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (user && bcryptjs_1.default.compareSync(req.body.password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: (0, generateToken_1.generateToken)(user),
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.signinUser = signinUser;
// signupuser controller
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        console.log("Request body:", req.body);
        // Check if the email already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        // Determine if the user is an admin based on the role
        const isAdmin = role === "admin";
        // Hash the password
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const user = yield User_1.default.create({
            name,
            email,
            password: hashedPassword,
            role,
            isAdmin,
        });
        console.log("User created:", user);
        // Generate token
        const token = (0, generateToken_1.generateToken)(user);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            token,
        });
    }
    catch (error) {
        /*  res.status(500).json({ message: "Server error" }); */
        console.error("Error creating user:", error.message, error);
        res
            .status(500)
            .json({ message: "User creation failed", error: error.message });
    }
});
exports.signupUser = signupUser;
// Update profile controller
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = bcryptjs_1.default.hashSync(req.body.password, 8);
            }
            const updatedUser = yield user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: (0, generateToken_1.generateToken)(updatedUser),
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateUserProfile = updateUserProfile;
// get users - admin
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUsers = getUsers;
//  get a user by ID - admin
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
});
exports.getUserById = getUserById;
// update a user - admin
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);
            const updatedUser = yield user.save();
            res.send({ message: "User Updated", user: updatedUser });
        }
        else {
            res.status(404).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error in Updating User" });
    }
});
exports.updateUser = updateUser;
// delete a user - admin
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        if (user.isAdmin) {
            return res.status(400).json({ message: "Cannot Delete Admin User" });
        }
        yield User_1.default.deleteOne({ _id: req.params.id });
        res.send({ message: "User Deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Error in Deleting User" });
    }
});
exports.deleteUser = deleteUser;
// get the current user's information
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            res.send(user);
        }
        else {
            res.status(404).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error in Fetching User" });
    }
});
exports.getCurrentUser = getCurrentUser;
