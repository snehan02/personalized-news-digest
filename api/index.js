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

/* ---------------- MIDDLEWARE ---------------- */
import cors from "cors";

app.use(express.json());

app.use(
  cors({
    origin: true, // 🔥 ALLOW ALL ORIGINS (REQUIRED FOR VERCEL)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 🔥 REQUIRED for preflight
app.options("*", cors());



/* ---------------- DB ---------------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

/* ---------------- AUTH ---------------- */
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

/* ---------------- AUTH ROUTES ---------------- */
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hashed,
    topics: [],
    subscribed: true
  });

  res.json({ message: "Registered" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* ---------------- TOPICS ---------------- */
app.get("/api/topics", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ topics: user.topics });
});

app.post("/api/topics/add", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $addToSet: { topics: req.body.topic } },
    { new: true }
  );
  res.json({ topics: user.topics });
});

app.post("/api/topics/remove", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $pull: { topics: req.body.topic } },
    { new: true }
  );
  res.json({ topics: user.topics });
});

/* ---------------- SUBSCRIPTION TOGGLE ---------------- */
app.post("/api/subscription/toggle", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.subscribed = !user.subscribed;
  await user.save();
  res.json({ subscribed: user.subscribed });
});

/* ---------------- COMMON NEWS ---------------- */
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
  } catch (error) {
    console.error("❌ News fetch failed:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

/* ---------------- SEND DIGEST ---------------- */
async function sendEmail(user) {
  if (!user.subscribed || user.topics.length === 0) return;

  const news = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: user.topics.join(" OR "),
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 5
    }
  });

  let html = `<h2>Your News Digest</h2>`;
  news.data.articles.forEach(a => {
    html += `<p><b>${a.title}</b><br>${a.description || ""}</p>`;
  });

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: "snehan102@gmail.com", name: "News Digest" },
      to: [{ email: user.email }],
      subject: "📰 Your News Digest",
      htmlContent: html
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
}

app.post("/api/digest/send", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  await sendEmail(user);
  res.json({ message: "Digest sent" });
});

/* ---------------- CRON (Vercel runs only on request, keep for local) ---------------- */



export default app;
