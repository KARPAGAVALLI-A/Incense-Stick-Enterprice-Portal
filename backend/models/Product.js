import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  need: { type: String, default: "" },
  avail: { type: String, default: "" },
  status: { type: String, default: "In Stock" },
  tone: { type: String, default: "green" }
});

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    icon: { type: String, default: "🪔" },
    status: { type: String, default: "In Stock" },
    tone: { type: String, default: "blue" },
    pct: { type: Number, default: 0 },
    inProd: { type: Number, default: 0 },
    target: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    toComplete: { type: Number, default: 0 },
    materials: [materialSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
