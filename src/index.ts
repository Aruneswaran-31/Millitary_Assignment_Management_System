import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://militryfrontend.netlify.app",
}));
app.use(express.json());

// example route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// 👇 PASTE HERE (VERY BOTTOM)
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
