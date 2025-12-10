import { Router } from "express";
import { getMovements, getDashboardMetrics } from "../controllers/movementController";
import { authenticateJwt } from "../middleware/auth";

const router = Router();

router.get("/", authenticateJwt, getMovements);
router.get("/metrics", authenticateJwt, getDashboardMetrics);

export default router;
