ALTER TABLE "alert_incidents" ADD COLUMN "status" text DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_incidents" ADD COLUMN "acknowledged_at" timestamp;--> statement-breakpoint
ALTER TABLE "alert_incidents" ADD COLUMN "resolved_at" timestamp;