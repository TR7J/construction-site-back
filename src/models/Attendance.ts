import mongoose, { Document, Schema } from "mongoose";

export interface IAttendance extends Document {
  workerId: Schema.Types.ObjectId;
  date: Date;
  status: "Present" | "Absent";
}

const AttendanceSchema: Schema<IAttendance> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
