// models/Project.ts
import mongoose, { Document, Schema } from "mongoose";

interface Project extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tenantId: mongoose.Schema.Types.ObjectId;
}

const projectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model<Project>("Project", projectSchema);
export default Project;
