import { alertRules } from "../alerts/alertRules";
import { canTriggerAlert, markAlertTriggered } from "../alerts/alertState";
import { countLogs } from "./alertQuery.service";

import { getErrorTrends } from "./errorMetrics.service";

export async function evaluateAlerts() {
  for (const rule of alertRules) {
    const buckets = await getErrorTrends(
      rule.service,
      rule.windowMinutes
    );

    const totalErrors = buckets.reduce(
      (sum: any, b: { count: any; }) => sum + b.count,
      0
    );

    console.log(
      `[ALERT DEBUG] service=${rule.service} totalErrors=${totalErrors}`
    );

    if (totalErrors >= rule.threshold) {
      if (canTriggerAlert(rule.id, rule.cooldownMinutes)) {
        triggerAlert(rule, totalErrors);
        markAlertTriggered(rule.id);
      }
    }
  }
}



function triggerAlert(rule: any, count: number) {
  console.error(
    `🚨 ALERT: ${rule.service} has ${count} ${rule.level} logs in ${rule.windowMinutes} minutes`
  );
}
