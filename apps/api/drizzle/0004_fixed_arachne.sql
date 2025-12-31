ALTER TABLE "alert_incidents" ADD COLUMN "fingerprint" text NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_alert_incidents_fingerprint" ON "alert_incidents" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX "idx_alert_incidents_active_fingerprint" ON "alert_incidents" USING btree ("fingerprint","status");