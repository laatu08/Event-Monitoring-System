export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEvent {
  service: string;
  level: LogLevel;
  message: string;
  timestamp: string; // ISO string
  meta?: Record<string, unknown>;
}
