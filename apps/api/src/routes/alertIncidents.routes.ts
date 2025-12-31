import { Router } from "express";
import { acknowledge, listIncidents, resolve } from "../controllers/alertIncidents.controller";

const router = Router();

router.get("/", listIncidents);

router.post("/:id/acknowledge", acknowledge);
router.post("/:id/resolve", resolve);


export default router;
