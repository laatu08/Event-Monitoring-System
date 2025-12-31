import { Router } from "express";
import { listAlertServices } from "../controllers/alertMeta.controller";

const router = Router();

router.get("/services", listAlertServices);

export default router;
