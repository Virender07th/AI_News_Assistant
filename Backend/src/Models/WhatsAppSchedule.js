// models/WhatsAppSchedule.js
import mongoose from "mongoose";

const WhatsAppScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    scheduledTime: {
      type: String, // e.g. "08:30"
      required: true,
    },
    payload: {
      type: Object, // <-- store the full payload JSON
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduleId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WhatsAppSchedule", WhatsAppScheduleSchema);
