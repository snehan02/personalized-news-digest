import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  console.log("Testing MongoDB connection...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connection successful!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
    process.exit(1);
  }
}

test();
