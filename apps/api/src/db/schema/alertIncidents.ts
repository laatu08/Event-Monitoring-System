import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp
} from "drizzle-orm/pg-core";

export const alertIncidents = pgTable("alert_incidents", {
  id: uuid("id").defaultRandom().primaryKey(),

  ruleId: uuid("rule_id").notNull(),

  service: text("service").notNull(),

  errorCount: integer("error_count").notNull(),

  windowMinutes: integer("window_minutes").notNull(),

  triggeredAt: timestamp("triggered_at", {
    withTimezone: true
  }).defaultNow().notNull()
});
