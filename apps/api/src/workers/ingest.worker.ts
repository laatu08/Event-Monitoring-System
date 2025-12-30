import { Worker } from "bullmq";
import redis from "../lib/redis";
import { LOG_QUEUE_NAME } from "../lib/logQueue";
import { storeLog } from "../services/logStorage.service";

const worker = new Worker(
  LOG_QUEUE_NAME,
  async (job) => {
    const log = job.data;

    // TEMP: simulate storage
    console.log("🛠 Processing log:", log);

    // later: send to Elasticsearch
    await storeLog(log);

    console.log("📦 Stored log in Elasticsearch");
  },
  {
    connection: redis
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
