import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  console.log("Testing News API...");
  try {
    const news = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: { country: "us", pageSize: 1, apiKey: process.env.NEWS_API_KEY }
    });
    console.log("✅ News API successful!");
  } catch (err) {
    console.error("❌ News API failed:", err.response?.data || err.message);
  }

  console.log("\nTesting Brevo API (SMTP test)...");
  try {
    const res = await axios.get("https://api.brevo.com/v3/smtp/statistics/events", {
      headers: { "api-key": process.env.BREVO_API_KEY }
    });
    console.log("✅ Brevo API key is valid!");
  } catch (err) {
    console.error("❌ Brevo API failed:", err.response?.data || err.message);
  }
}

test();
