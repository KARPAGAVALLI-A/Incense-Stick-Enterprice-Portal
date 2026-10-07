import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";

console.log("🚀 Running Database Seed Script...");
await connectDB();
console.log("🌱 Seed complete. Exiting.");
process.exit(0);
