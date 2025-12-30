import { Queue } from "bullmq";
import redis from "./redis";

export const LOG_QUEUE_NAME = "log-ingestion";

export const logQueue = new Queue(LOG_QUEUE_NAME, {
  connection: redis
});
