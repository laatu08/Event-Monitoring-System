import { alertRules } from "../alerts/alertRules";
import { canTriggerAlert, markAlertTriggered } from "../alerts/alertState";
import { countLogs } from "./alertQuery.service";

export async function evaluateAlerts() {
  for (const rule of alertRules) {
    const count = await countLogs(
      rule.service,
      rule.level,
      rule.windowMinutes
    );

    if (count >= rule.threshold) {
      if (canTriggerAlert(rule.id, rule.cooldownMinutes)) {
        triggerAlert(rule, count);
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
