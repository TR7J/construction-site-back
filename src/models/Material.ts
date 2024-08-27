import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  milestone: string; // Added milestone
  history: Array<{
    date: Date;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    unitType: string;
    milestone: string; // Added milestone to history
  }>;
}

const materialSchema: Schema<IMaterial> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["Pieces", "Lorries", "Bags", "Feet"],
    },
    milestone: {
      type: String,
      required: true,
      enum: ["Foundations", "Slab", "Walling", "Rinto", "Roofing"], // List of possible milestones
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
        milestone: String, // Added milestone to history
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model<IMaterial>("Material", materialSchema);

export default Material;
