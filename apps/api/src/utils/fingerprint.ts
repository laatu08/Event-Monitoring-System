export function getAlertFingerprint(
  service: string,
  ruleId: string
) {
  return `${service}:${ruleId}`;
}
