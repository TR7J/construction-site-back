import mongoose, { Document, Schema } from "mongoose";

export interface IMaterialIssuance extends Document {
  workerId: Schema.Types.ObjectId;
  materialId: Schema.Types.ObjectId;
  quantity: number;
  round: string;
}

const materialIssuanceSchema: Schema<IMaterialIssuance> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    materialId: {
      type: Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    round: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MaterialIssuance = mongoose.model<IMaterialIssuance>(
  "MaterialIssuance",
  materialIssuanceSchema
);

export default MaterialIssuance;
