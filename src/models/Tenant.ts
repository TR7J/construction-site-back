import mongoose, { Document, Schema, Model } from "mongoose";

interface ITenant extends Document {
  name: string;
}

const tenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
});

const Tenant: Model<ITenant> = mongoose.model("Tenant", tenantSchema);

export default Tenant;
