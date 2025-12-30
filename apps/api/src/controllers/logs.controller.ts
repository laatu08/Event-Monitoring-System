import { Request, Response } from "express";
import { logQuerySchema } from "../schemas/logQuery.schema";
import { queryLogs } from "../services/logQuery.service";

export async function getLogs(req: Request, res: Response) {
  const parsed = logQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.error.format()
    });
  }

  const data = await queryLogs(parsed.data);
  res.json(data);
}
