import { db } from "../db";
import { alertIncidents } from "../db/schema/alertIncidents";
import { desc } from "drizzle-orm";
import { Request, Response } from "express";

export async function listIncidents(req:Request, res:Response) {
  const incidents = await db
    .select()
    .from(alertIncidents)
    .orderBy(desc(alertIncidents.triggeredAt))
    .limit(100);

  res.json(incidents);
}
