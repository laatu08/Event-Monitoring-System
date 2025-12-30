import client from "../lib/elastic";
import { LogQuery } from "../schemas/logQuery.schema";

export async function queryLogs(query: LogQuery) {
  const { service, level, from, to, page, limit } = query;

  const must: any[] = [];

  if (service) {
    must.push({ term: { service } });
  }

  if (level) {
    must.push({ term: { level } });
  }

  if (from || to) {
    must.push({
      range: {
        timestamp: {
          gte: from,
          lte: to
        }
      }
    });
  }

  const result = await client.search({
    index: "logs-*",
    from: (page - 1) * limit,
    size: limit,
    sort: [{ timestamp: { order: "desc" } }],
    query: {
      bool: { must }
    }
  });

  return {
    total: typeof result.hits.total === "number"
      ? result.hits.total
      : result.hits.total?.value || 0,
    logs: result.hits.hits.map((hit) => hit._source)
  };
}
