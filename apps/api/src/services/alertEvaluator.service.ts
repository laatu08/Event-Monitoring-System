import { recordIncident } from "../repositories/alertIncident.repo";
import {
  getActiveAlertRules,
  markAlertTriggered,
} from "../repositories/alertRule.repo";
import { getErrorTrends } from "./errorMetrics.service";
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
    const buckets = await getErrorTrends(rule.service, rule.windowMinutes);

    const totalErrors = buckets.reduce(
      (sum: any, b: { count: any }) => sum + b.count,
      0
    );

    console.log(
      `[ALERT DEBUG] service=${rule.service} totalErrors=${totalErrors}`
    );

    if (totalErrors >= rule.threshold) {
      if (canTriggerAlert(rule)) {
        console.log(
          `🚨 ALERT: ${rule.service} had ${totalErrors} errors in ${rule.windowMinutes} minutes`
        );

        await recordIncident({
          ruleId: rule.id,
          service: rule.service,
          errorCount: totalErrors,
          windowMinutes: rule.windowMinutes,
        });

        await sendNotifications({
          type: "error_alert",
          service: rule.service,
          errorCount: totalErrors,
          windowMinutes: rule.windowMinutes,
          triggeredAt: new Date().toISOString(),
        });

        await markAlertTriggered(rule.id);
      }
    }
  }
}
