import { Router } from "express";
import {
  listChannels,
  createChannel,
  toggleChannel
} from "../controllers/notificationChannels.controller";

const router = Router();

router.get("/", listChannels);
router.post("/", createChannel);
router.patch("/:id", toggleChannel);

export default router;
