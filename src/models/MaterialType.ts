import mongoose, { Document, Schema } from "mongoose";

export interface IMaterialType extends Document {
  name: string;
  description?: string;
}

const materialTypeSchema: Schema<IMaterialType> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MaterialType = mongoose.model<IMaterialType>(
  "MaterialType",
  materialTypeSchema
);

export default MaterialType;
