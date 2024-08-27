import mongoose, { Schema, Document } from "mongoose";

interface IMainSupervisor {
  name: string;
  pay: number;
}

interface IFundi {
  name: string;
  pay: number;
}

interface IHelper {
  name: string;
  pay: number;
}

export interface ILabour extends Document {
  date: string;
  milestone: string;
  labourType: string;
  mainSupervisor: IMainSupervisor;
  fundis: IFundi[];
  helpers: IHelper[];
  totalFundisPay: number;
  totalHelpersPay: number;
  totalPay: number;
}

const LabourSchema: Schema = new Schema({
  date: { type: String, required: true },
  milestone: { type: String, required: true },
  labourType: { type: String, required: true },
  mainSupervisor: {
    name: { type: String, required: true },
    pay: { type: Number, required: true },
  },
  fundis: [
    {
      name: { type: String, required: true },
      pay: { type: Number, required: true },
    },
  ],
  helpers: [
    {
      name: { type: String, required: true },
      pay: { type: Number, required: true },
    },
  ],
  totalFundisPay: { type: Number, required: true },
  totalHelpersPay: { type: Number, required: true },
  totalPay: { type: Number, required: true },
});

export default mongoose.model<ILabour>("Labour", LabourSchema);
