import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index
} from "drizzle-orm/pg-core";

export const alertIncidents = pgTable(
  "alert_incidents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ruleId: uuid("rule_id").notNull(),

    service: text("service").notNull(),

    // 🔑 Deduplication fingerprint
    fingerprint: text("fingerprint").notNull(),

    errorCount: integer("error_count").notNull(),

    windowMinutes: integer("window_minutes").notNull(),

    // when incident was first created / (re)opened
    triggeredAt: timestamp("triggered_at", {
      withTimezone: true
    })
      .defaultNow()
      .notNull(),

    // 🔥 NEW: last time errors were observed for this incident
    lastSeenErrorAt: timestamp("last_seen_error_at", {
      withTimezone: true
    })
      .defaultNow()
      .notNull(),

    // lifecycle
    status: text("status").default("open").notNull(),

    acknowledgedAt: timestamp("acknowledged_at"),
    resolvedAt: timestamp("resolved_at")
  },
  (table) => ({
    // 🔥 fast dedup lookup
    fingerprintIdx: index("idx_alert_incidents_fingerprint").on(
      table.fingerprint
    ),

    // 🔥 fast active incident lookup
    activeFingerprintIdx: index(
      "idx_alert_incidents_active_fingerprint"
    ).on(table.fingerprint, table.status),

    // 🔥 efficient quiet-period checks
    lastSeenIdx: index("idx_alert_incidents_last_seen").on(
      table.lastSeenErrorAt
    )
  })
);
