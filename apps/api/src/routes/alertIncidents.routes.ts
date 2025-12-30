import { Router } from "express";
import { listIncidents } from "../controllers/alertIncidents.controller";

const router = Router();

router.get("/", listIncidents);

export default router;
