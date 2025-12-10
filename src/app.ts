import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import purchasesRouter from "./routes/purchases";
import transfersRouter from "./routes/transfers";
import movementsRouter from "./routes/movments";

import adminBasesRouter from './routes/adminBases';
import adminEquipmentRouter from './routes/adminEquipment';
import adminUsersRouter from './routes/adminUsers';


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/transfers", transfersRouter);
app.use("/api/movements", movementsRouter);

app.use('/api/admin/bases', adminBasesRouter);
app.use('/api/admin/equipment', adminEquipmentRouter);
app.use('/api/admin/users', adminUsersRouter);
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
