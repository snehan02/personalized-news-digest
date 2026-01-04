function auth(req, res, next) {
  console.log("HEADERS RECEIVED:", req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "authentication not found in headers" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}


dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://personalized-news-digest-do8r.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
