import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    customer: { type: String, required: true },
    product: { type: String, required: true },
    qty: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered"],
      default: "Placed"
    },
    placed: { type: String, default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
    updated: { type: String, default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
