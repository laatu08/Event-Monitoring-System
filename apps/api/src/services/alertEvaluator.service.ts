import {
  recordIncident,
  findIncidentByFingerprint,
  reopenIncident,
  updateLastSeenErrorAt
} from "../repositories/alertIncident.repo";
import {
  getActiveAlertRules,
  markAlertTriggered
} from "../repositories/alertRule.repo";
import { countErrorsInWindow } from "./errorMetrics.service";
import { sendNotifications } from "./notification.service";
import { getAlertFingerprint } from "../utils/fingerprint";
import { isUniqueViolation } from "../utils/dbErrors";

function canTriggerAlert(rule: any) {
  if (!rule.lastTriggeredAt) return true;

  const last = new Date(rule.lastTriggeredAt).getTime();
  const now = Date.now();

  return now - last > rule.cooldownMinutes * 60 * 1000;
}

function hasQuietPeriodPassed(
  lastSeenErrorAt: Date,
  windowMinutes: number
) {
  const quietMinutes = Math.max(windowMinutes * 2, 15);
  const quietMs = quietMinutes * 60 * 1000;

  return Date.now() - new Date(lastSeenErrorAt).getTime() >= quietMs;
}

function shouldReopenIncident(
    resolvedErrorAt: Date,
    lastSeenErrorAt: Date,
  windowMinutes: number
) {
  const quietMinutes = Math.max(windowMinutes * 2, 15);
  const quietMs = quietMinutes * 60 * 1000;

  const resolvedAt = new Date(resolvedErrorAt).getTime();
  const lastSeen = new Date(lastSeenErrorAt).getTime();

  // 🔑 Only reopen if errors resumed AFTER a quiet period
  return lastSeen - resolvedAt >= quietMs;
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

    const fingerprint = getAlertFingerprint(
      rule.service,
      rule.id
    );

    const existing = await findIncidentByFingerprint(fingerprint);

    // 🟢 ACTIVE incident → update signal & suppress
    if (
      existing &&
      (existing.status === "open" ||
        existing.status === "acknowledged")
    ) {
      await updateLastSeenErrorAt(existing.id);

      console.log(
        `[ALERT SUPPRESSED] active incident fingerprint=${fingerprint}`
      );
      continue;
    }

    // 🟡 RESOLVED → reopen only if quiet period passed
    if (existing && existing.status === "resolved") {
      if (
        // hasQuietPeriodPassed(
        //   existing.lastSeenErrorAt,
        //   rule.windowMinutes
        // )
        shouldReopenIncident(existing.resolvedAt!, existing.lastSeenErrorAt, rule.windowMinutes)
      ) {
        console.log(
          `[INCIDENT REOPENED] fingerprint=${fingerprint}`
        );

        await reopenIncident(existing.id);

        await sendNotifications({
          type: "error_alert_reopened",
          service: rule.service,
          errorCount: totalErrors,
          windowMinutes: rule.windowMinutes,
          triggeredAt: new Date().toISOString(),
          incidentId: existing.id
        });

        await markAlertTriggered(rule.id);
      } else {
        console.log(
          `[ALERT SUPPRESSED] errors resumed too soon after resolution fingerprint=${fingerprint}`
        );
      }

      continue;
    }

    // 🔴 CREATE new incident
    try {
      console.log(
        `🚨 ALERT CREATED service=${rule.service} fingerprint=${fingerprint}`
      );

      const incident = await recordIncident({
        ruleId: rule.id,
        service: rule.service,
        fingerprint,
        errorCount: totalErrors,
        windowMinutes: rule.windowMinutes
      });

      await sendNotifications({
        type: "error_alert",
        service: rule.service,
        errorCount: totalErrors,
        windowMinutes: rule.windowMinutes,
        triggeredAt: new Date().toISOString(),
        incidentId: incident.id
      });

      await markAlertTriggered(rule.id);
    } catch (err: any) {
      if (isUniqueViolation(err)) {
        console.log(
          `[ALERT SUPPRESSED - DB] fingerprint=${fingerprint}`
        );
        continue;
      }
      throw err;
    }
  }
}
