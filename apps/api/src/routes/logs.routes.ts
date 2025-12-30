import { Router } from "express";
import { logSchema } from "../schemas/log.schema";

const router = Router();

router.post("/", (req, res) => {
  const parsed = logSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid log payload",
      details: parsed.error.format()
    });
  }

  // TEMP: just print it
  console.log("📥 Log received:", parsed.data);

  return res.status(202).json({ status: "accepted" });
});

export default router;
