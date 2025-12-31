import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { alertIncidents } from "../db/schema/alertIncidents";

export async function recordIncident(data: {
  ruleId: string;
  service: string;
  fingerprint: string;
  errorCount: number;
  windowMinutes: number;
}) {
  const [incident] = await db
    .insert(alertIncidents)
    .values({
      ruleId: data.ruleId,
      service: data.service,
      fingerprint: data.fingerprint,
      errorCount: data.errorCount,
      windowMinutes: data.windowMinutes
    })
    .returning();

  return incident;
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

export async function findIncidentByFingerprint(
  fingerprint: string
) {
  return db.query.alertIncidents.findFirst({
    where: (incidents, { eq }) =>
      eq(incidents.fingerprint, fingerprint),
    orderBy: (incidents, { desc }) => [
      desc(incidents.triggeredAt)
    ]
  });
}

export async function reopenIncident(id: string) {
  await db
    .update(alertIncidents)
    .set({
      status: "open",
      acknowledgedAt: null,
      resolvedAt: null,
      triggeredAt: new Date()
    })
    .where(eq(alertIncidents.id, id));
}

export async function updateLastSeenErrorAt(id: string) {
  await db
    .update(alertIncidents)
    .set({ lastSeenErrorAt: new Date() })
    .where(eq(alertIncidents.id, id));
}
