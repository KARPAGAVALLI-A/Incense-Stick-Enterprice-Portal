import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import Order from "../models/Order.js";
import Task from "../models/Task.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import {
  EMPLOYEES,
  INVENTORY_ITEMS,
  ORDERS,
  TASKS,
  PRODUCTS,
  NOTIFICATIONS,
  USERS
} from "../data/seedData.js";

let isMongoConnected = false;

export function getMongoStatus() {
  return {
    connected: isMongoConnected,
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ise_system",
    readyState: mongoose.connection.readyState
  };
}

export async function seedDatabaseIfEmpty() {
  try {
    const empCount = await Employee.countDocuments();
    if (empCount === 0) {
      console.log("🌱 Seeding 50 Employees into MongoDB...");
      await Employee.insertMany(EMPLOYEES);
    }

    const invCount = await Inventory.countDocuments();
    if (invCount === 0) {
      console.log("🌱 Seeding Inventory into MongoDB...");
      await Inventory.insertMany(INVENTORY_ITEMS);
    }

    const ordCount = await Order.countDocuments();
    if (ordCount === 0) {
      console.log("🌱 Seeding Orders into MongoDB...");
      await Order.insertMany(ORDERS);
    }

    const tskCount = await Task.countDocuments();
    if (tskCount === 0) {
      console.log("🌱 Seeding Tasks into MongoDB...");
      await Task.insertMany(TASKS);
    }

    const prdCount = await Product.countDocuments();
    if (prdCount === 0) {
      console.log("🌱 Seeding Products into MongoDB...");
      await Product.insertMany(PRODUCTS);
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      console.log("🌱 Seeding Notifications into MongoDB...");
      await Notification.insertMany(NOTIFICATIONS);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding Demo Users into MongoDB...");
      await User.insertMany(USERS);
    }

    console.log("✅ MongoDB Database 'ise_system' is fully populated and ready for MongoDB Compass!");
  } catch (err) {
    console.error("⚠️ Error while auto-seeding MongoDB:", err.message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ise_system";
  console.log(`🔌 Attempting to connect to MongoDB at: ${uri}`);

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });

    isMongoConnected = true;
    console.log("🍃 ========================================================");
    console.log("🍃 Connected to MongoDB successfully!");
    console.log(`🍃 Database: ise_system`);
    console.log("🍃 View in MongoDB Compass: Connect to mongodb://127.0.0.1:27017");
    console.log("🍃 ========================================================");

    await seedDatabaseIfEmpty();
  } catch (error) {
    isMongoConnected = false;
    console.warn("⚠️ ========================================================");
    console.warn(`⚠️ Could not connect to MongoDB: ${error.message}`);
    console.warn("⚠️ TIP: If you have MongoDB Compass or local MongoDB, start the service");
    console.warn("⚠️ Or update MONGODB_URI in backend/.env with your MongoDB Atlas or local URL.");
    console.warn("⚠️ Server will automatically switch to local JSON database mode!");
    console.warn("⚠️ ========================================================");
  }
}
