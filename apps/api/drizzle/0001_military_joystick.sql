CREATE TABLE "alert_incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" uuid NOT NULL,
	"service" text NOT NULL,
	"error_count" integer NOT NULL,
	"window_minutes" integer NOT NULL,
	"triggered_at" timestamp with time zone DEFAULT now() NOT NULL
);
