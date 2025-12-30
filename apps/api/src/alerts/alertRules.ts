export interface AlertRule {
  id: string;
  service: string;
  level: "error" | "fatal";
  threshold: number;
  windowMinutes: number;
  cooldownMinutes: number;
}

export const alertRules: AlertRule[] = [
  {
    id: "auth-error-spike",
    service: "auth-service",
    level: "error",
    threshold: 5,
    windowMinutes: 5,
    cooldownMinutes: 10
  }
];
