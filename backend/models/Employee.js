import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    dept: { type: String, required: true },
    status: { type: String, default: "Present" },
    production: { type: Number, default: 0 },
    joined: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    salary: { type: Number, default: 18000 }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
