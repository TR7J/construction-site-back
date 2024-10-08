"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const materialSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    unitType: {
        type: String,
        required: true,
        enum: ["Pieces", "Lorries", "Bags", "Feet", "Wheelbarrows", "Litters"],
    },
    milestone: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Date for when the material entry was created
        required: true,
    },
    history: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            name: String,
            quantity: Number,
            unitPrice: Number,
            totalPrice: Number,
            unitType: String,
            milestone: String,
        },
    ],
    tenantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
}, {
    timestamps: true, // This will also track createdAt and updatedAt timestamps automatically
});
const Material = mongoose_1.default.model("Material", materialSchema);
exports.default = Material;
