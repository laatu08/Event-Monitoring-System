import client from "../lib/elastic";
import { LogSchema } from "../schemas/log.schema";

function getIndexName(timestamp: string) {
  const date = new Date(timestamp).toISOString().split("T")[0];
  return `logs-${date}`;
}

export async function storeLog(log: LogSchema) {
  const index = getIndexName(log.timestamp);

  try {
    await client.index({
      index,
      document: {
        ...log,
        timestamp: new Date(log.timestamp),
      },
    });
  } catch (err) {
    console.error("❌ Failed to index log", err);
    throw err; // BullMQ retry kicks in
  }
}
