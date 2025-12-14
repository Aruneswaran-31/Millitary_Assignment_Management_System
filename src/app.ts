import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// allow preflight
app.options("*", cors());

app.use(express.json());

// health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// routes
app.use("/api", authRoutes);

export default app;
