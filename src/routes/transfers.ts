import { Router } from "express";
import { createTransfer } from "../controllers/transferController";
import { authenticateJwt } from "../middleware/auth";

const router = Router();
router.post("/", authenticateJwt, createTransfer);
export default router;
