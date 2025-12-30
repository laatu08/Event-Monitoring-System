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
