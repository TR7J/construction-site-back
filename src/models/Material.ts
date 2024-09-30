import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  milestone: string;
  date: Date; // Added date for the material itself
  history: Array<{
    date: Date;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    unitType: string;
    milestone: string;
  }>;
  tenantId: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
}

const materialSchema: Schema<IMaterial> = new Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true, // This will also track createdAt and updatedAt timestamps automatically
  }
);

const Material = mongoose.model<IMaterial>("Material", materialSchema);

export default Material;
