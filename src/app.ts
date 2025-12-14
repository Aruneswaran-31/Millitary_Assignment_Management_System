import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

app.use(cors({
  origin: "https://militryfrontend.netlify.app"
}));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRoutes);

export default app;
