import { db } from "../db/index";
import { alertRules } from "../db/schema/alertRules";
import { eq } from "drizzle-orm";

export async function getActiveAlertRules() {
  return db
    .select()
    .from(alertRules)
    .where(eq(alertRules.enabled, true));
}

export async function markAlertTriggered(ruleId: string) {
  await db
    .update(alertRules)
    .set({ lastTriggeredAt: new Date() })
    .where(eq(alertRules.id, ruleId));
}
