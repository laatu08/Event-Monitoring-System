import { getActiveIncidentForRule, recordIncident } from "../repositories/alertIncident.repo";
import {
  getActiveAlertRules,
  markAlertTriggered
} from "../repositories/alertRule.repo";
import { countErrorsInWindow } from "./errorMetrics.service";
import { sendNotifications } from "./notification.service";

function canTriggerAlert(rule: any) {
  if (!rule.lastTriggeredAt) return true;

  const last = new Date(rule.lastTriggeredAt).getTime();
  const now = Date.now();

  return now - last > rule.cooldownMinutes * 60 * 1000;
}

export async function evaluateAlerts() {
  const rules = await getActiveAlertRules();

  for (const rule of rules) {
    const totalErrors = await countErrorsInWindow(
      rule.service,
      rule.windowMinutes
    );

    console.log(
      `[ALERT DEBUG] service=${rule.service} errors=${totalErrors} window=${rule.windowMinutes}m`
    );

    if (totalErrors < rule.threshold) continue;
    if (!canTriggerAlert(rule)) continue;

    const activeIncident = await getActiveIncidentForRule(rule.id);

    if (activeIncident) {
      console.log(
        `[ALERT SKIPPED] Incident already ${activeIncident.status} for rule=${rule.id}`
      );
      continue;
    }

    console.log(
      `🚨 ALERT: ${rule.service} had ${totalErrors} errors in ${rule.windowMinutes} minutes`
    );

    await recordIncident({
      ruleId: rule.id,
      service: rule.service,
      errorCount: totalErrors,
      windowMinutes: rule.windowMinutes
    });

    await sendNotifications({
      type: "error_alert",
      service: rule.service,
      errorCount: totalErrors,
      windowMinutes: rule.windowMinutes,
      triggeredAt: new Date().toISOString()
    });

    await markAlertTriggered(rule.id);
  }
}
