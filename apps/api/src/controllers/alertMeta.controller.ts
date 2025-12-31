import { db } from "../db";
import { alertRules } from "../db/schema/alertRules";
import { sql } from "drizzle-orm";
import { Request, Response } from "express";

export async function listAlertServices(req:Request, res:Response) {
  const rows = await db.execute(
    sql`SELECT DISTINCT service FROM alert_rules WHERE enabled = true`
  );

  res.json(rows.rows.map((r) => r.service));
}
