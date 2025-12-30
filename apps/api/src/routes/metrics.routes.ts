import { Router } from "express";
import { getErrorMetrics } from "../controllers/metrics.controller";

const router = Router();

router.get("/errors", getErrorMetrics);

export default router;
