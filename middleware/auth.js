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

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
