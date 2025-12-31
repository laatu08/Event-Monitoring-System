import { db } from "../db";
import { alertIncidents } from "../db/schema/alertIncidents";
import { desc } from "drizzle-orm";
import { Request, Response } from "express";
import { acknowledgeIncident, resolveIncident } from "../repositories/alertIncident.repo";

export async function listIncidents(req:Request, res:Response) {
  const incidents = await db
    .select()
    .from(alertIncidents)
    .orderBy(desc(alertIncidents.triggeredAt))
    .limit(100);

  res.json(incidents);
}

export async function acknowledge(req:Request, res:Response) {
  await acknowledgeIncident(req.params.id);
  res.json({ ok: true });
}

export async function resolve(req:Request, res:Response) {
  await resolveIncident(req.params.id);
  res.json({ ok: true });
}
