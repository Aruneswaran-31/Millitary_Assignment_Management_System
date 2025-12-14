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

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", authRoutes);

export default app;
