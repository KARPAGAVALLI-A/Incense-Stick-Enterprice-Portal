import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    audience: { type: String, enum: ["admin", "manager", "employee", "all"], default: "admin" },
    title: { type: String, required: true },
    body: { type: String, required: true },
    time: { type: Number, default: () => Date.now() },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
