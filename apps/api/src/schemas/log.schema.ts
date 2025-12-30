import { z } from "zod";

export const logSchema = z.object({
  service: z.string().min(1),
  level: z.enum(["debug", "info", "warn", "error", "fatal"]),
  message: z.string().min(1),
  timestamp: z.string().datetime(),
  meta: z.record(z.string(),z.any()).optional()
});

export type LogSchema = z.infer<typeof logSchema>;
