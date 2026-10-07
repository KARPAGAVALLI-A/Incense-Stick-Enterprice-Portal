import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    icon: { type: String, default: "🪔" },
    name: { type: String, required: true },
    tag: { type: String, default: "" },
    warehouse: { type: String, default: "Salem Plant Warehouse" },
    stock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 5000 },
    status: { type: String, default: "In Stock" },
    tone: { type: String, default: "green" }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
