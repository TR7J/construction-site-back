import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  workerId: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  description?: string;
}

const paymentSchema: Schema<IPayment> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
