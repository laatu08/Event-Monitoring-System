import express from "express";
import cors from "cors";
import logsRouter from "./routes/logs.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/logs", logsRouter);

  // health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "event-logging-api" });
  });

  return app;
}
