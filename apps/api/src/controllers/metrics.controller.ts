import { Request, Response } from "express";
import { getErrorTrends } from "../services/errorMetrics.service";

export async function getErrorMetrics(req: Request, res: Response) {
  const service = req.query.service as string;
  const range = req.query.range as string;

  if (!service) {
    return res.status(400).json({ error: "service is required" });
  }

  const data = await getErrorTrends(service, range);
  res.json(data);
}
