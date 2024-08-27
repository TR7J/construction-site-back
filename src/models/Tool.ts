import mongoose, { Document, Schema } from "mongoose";

export interface ITool extends Document {
  name: string;
  description?: string;
  quantity: number;
}

const toolSchema: Schema<ITool> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Tool = mongoose.model<ITool>("Tool", toolSchema);

export default Tool;
