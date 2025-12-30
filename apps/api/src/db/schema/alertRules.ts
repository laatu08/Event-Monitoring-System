import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const alertRules = pgTable("alert_rules", {
  id: uuid("id").defaultRandom().primaryKey(),

  service: text("service").notNull(),

  threshold: integer("threshold").notNull(),

  windowMinutes: integer("window_minutes").notNull(),

  cooldownMinutes: integer("cooldown_minutes").notNull(),

  enabled: boolean("enabled").default(true).notNull(),

  lastTriggeredAt: timestamp("last_triggered_at", {
    withTimezone: true
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
});
