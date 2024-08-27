import mongoose, { Document, Schema } from "mongoose";

export interface IRemainingMaterials extends Document {
  materialId: Schema.Types.ObjectId;
  quantity: number;
  date: Date;
}

const remainingMaterialsSchema: Schema<IRemainingMaterials> = new Schema(
  {
    materialId: {
      type: Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RemainingMaterials = mongoose.model<IRemainingMaterials>(
  "RemainingMaterials",
  remainingMaterialsSchema
);

export default RemainingMaterials;
