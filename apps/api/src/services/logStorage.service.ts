import client from "../lib/elastic";
import { LogSchema } from "../schemas/log.schema";

function getIndexName(date: Date) {
  const day = date.toISOString().split("T")[0];
  return `app-logs-${day}`;
}


export async function storeLog(log: LogSchema) {
      const now = new Date();
  const index = getIndexName(now);

  try {
    await client.index({
      index,
      document: {
        ...log,
        level: log.level.toLowerCase(),
        timestamp: now,
      },
    });
  } catch (err) {
    console.error("❌ Failed to index log", err);
    throw err; // BullMQ retry kicks in
  }
}
