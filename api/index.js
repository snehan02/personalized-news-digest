import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// TEST ROUTE (MUST WORK)
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend working ✅" });
});

// TEST AUTH
app.post("/api/auth/login", (req, res) => {
  res.json({ token: "test-token" });
});

export default app;
