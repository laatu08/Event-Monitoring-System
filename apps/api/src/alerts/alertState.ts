const alertState = new Map<string, number>();

export function canTriggerAlert(
  ruleId: string,
  cooldownMinutes: number
) {
  const lastTriggered = alertState.get(ruleId);
  if (!lastTriggered) return true;

  const now = Date.now();
  return now - lastTriggered > cooldownMinutes * 60 * 1000;
}

export function markAlertTriggered(ruleId: string) {
  alertState.set(ruleId, Date.now());
}
