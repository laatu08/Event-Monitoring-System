import { Router } from "express";
import {
  listAlertRules,
  createAlertRule,
  toggleAlertRule,
  deleteAlertRule
} from "../controllers/alertRules.controller";

const router = Router();

router.get("/", listAlertRules);
router.post("/", createAlertRule);
router.patch("/:id", toggleAlertRule);
router.delete("/:id", deleteAlertRule);

export default router;
