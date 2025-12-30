import { db } from "../db";
import { alertRules } from "../db/schema/alertRules";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function listAlertRules(req: Request, res: Response) {
  const rules = await db.select().from(alertRules);
  res.json(rules);
}

export async function createAlertRule(req: Request, res: Response) {
  const { service, threshold, windowMinutes, cooldownMinutes } = req.body;

  const [rule] = await db
    .insert(alertRules)
    .values({
      service,
      threshold,
      windowMinutes,
      cooldownMinutes
    })
    .returning();

  res.status(201).json(rule);
}

export async function toggleAlertRule(req: Request, res: Response) {
  const { id } = req.params;
  const { enabled } = req.body;

  await db
    .update(alertRules)
    .set({ enabled })
    .where(eq(alertRules.id, id));

  res.json({ status: "updated" });
}

export async function deleteAlertRule(req: Request, res: Response) {
  const { id } = req.params;

  await db
    .delete(alertRules)
    .where(eq(alertRules.id, id));

  res.json({ status: "deleted" });
}
