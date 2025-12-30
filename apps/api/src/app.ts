import express from "express";
import cors from "cors";
import logsRouter from "./routes/logs.routes";
import metricsRouter from "./routes/metrics.routes";
import alertRulesRouter from "./routes/alertRules.routes";
import channelsRouter from "./routes/notificationChannels.routes"
import alertIncidentsRouter from "./routes/alertIncidents.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/logs", logsRouter);
  app.use("/api/metrics", metricsRouter);
  app.use("/api/alerts/rules", alertRulesRouter);
  app.use("/api/alerts/channels", channelsRouter);
  app.use("/api/alerts/incidents", alertIncidentsRouter);

  // health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "event-logging-api" });
  });

  return app;
}
