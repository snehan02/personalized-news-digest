import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import User from "../models/user.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ---------- DB ---------- */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("✅ MongoDB connected");
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

/* ---------- AUTH ---------- */
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ---------- ROUTES ---------- */
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed, topics: [], subscribed: true });

  res.json({ message: "Registered" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

app.get("/api/news/common", async (req, res) => {
  try {
    const news = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        pageSize: 6,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.json({ articles: news.data.articles });
  } catch (err) {
    console.error("❌ News API error:", err.message);
    res.status(500).json({ error: "News fetch failed" });
  }
});

export default app;
