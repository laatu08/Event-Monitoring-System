import { Router } from "express";
import { logSchema } from "../schemas/log.schema";
import { logQueue } from "../lib/logQueue";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = logSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid log payload",
      details: parsed.error.format()
    });
  }

  // enqueue log (async)
  await logQueue.add("ingest", parsed.data, {
    removeOnComplete: true,
    attempts: 3
  });

  return res.status(202).json({ status: "queued" });
});

export default router;
