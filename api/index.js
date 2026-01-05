import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Backend working ✅" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ token: "test-token" });
});

export default app;
