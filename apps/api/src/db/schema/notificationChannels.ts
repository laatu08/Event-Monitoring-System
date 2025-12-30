import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";

export const notificationChannels = pgTable("notification_channels", {
  id: uuid("id").defaultRandom().primaryKey(),

  type: text("type").notNull(), // 'webhook', 'slack' (future)

  target: text("target").notNull(), // URL or webhook endpoint

  enabled: boolean("enabled").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
});
