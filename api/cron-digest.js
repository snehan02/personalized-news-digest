import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

// Helper to send email (reused from index.js logic)
async function sendEmail(user) {
  if (!user.subscribed || user.topics.length === 0) return;

  try {
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

    await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: { email: "no-reply@brevo.com", name: "News Digest" },
      to: [{ email: user.email }],
      subject: "📰 Your News Digest",
      htmlContent: html
    }, {
      headers: { "api-key": process.env.BREVO_API_KEY }
    });
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error.message);
  }
}

export default async function handler(req, res) {
  // Verify Cron secret if you want to be secure (optional but recommended)
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).end('Unauthorized');
  // }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const users = await User.find({ subscribed: true });
    console.log(`Sending digests to ${users.length} users...`);
    
    for (const user of users) {
      await sendEmail(user);
    }

    res.status(200).json({ success: true, count: users.length });
  } catch (error) {
    console.error("Cron handler error:", error);
    res.status(500).json({ error: error.message });
  }
}
