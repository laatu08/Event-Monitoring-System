import { eq } from "drizzle-orm";
import { db } from "../db";
import { alertIncidents } from "../db/schema/alertIncidents";

export async function recordIncident(data: {
  ruleId: string;
  service: string;
  errorCount: number;
  windowMinutes: number;
}) {
  await db.insert(alertIncidents).values({
    ruleId: data.ruleId,
    service: data.service,
    errorCount: data.errorCount,
    windowMinutes: data.windowMinutes
  });
}

export async function acknowledgeIncident(id: string) {
  await db
    .update(alertIncidents)
    .set({
      status: "acknowledged",
      acknowledgedAt: new Date()
    })
    .where(eq(alertIncidents.id, id));
}

export async function resolveIncident(id: string) {
  await db
    .update(alertIncidents)
    .set({
      status: "resolved",
      resolvedAt: new Date()
    })
    .where(eq(alertIncidents.id, id));
}

export async function getActiveIncidentForRule(ruleId: string) {
  return db.query.alertIncidents.findFirst({
    where: (alertIncidents, { eq, ne }) =>
      eq(alertIncidents.ruleId, ruleId) &&
      ne(alertIncidents.status, "resolved")
  });
}
