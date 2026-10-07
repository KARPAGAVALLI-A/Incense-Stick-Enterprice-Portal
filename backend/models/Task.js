import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, default: "" },
    productName: { type: String, required: true },
    employeeId: { type: String, default: "" },
    employeeName: { type: String, default: "" },
    qty: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned"
    },
    assignedBy: { type: String, default: "Admin" },
    assignedDate: { type: String, default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
