import client from "../lib/elastic";

export async function countLogs(
  service: string,
  level: string,
  windowMinutes: number
) {
  const from = new Date(
    Date.now() - windowMinutes * 60 * 1000
  ).toISOString();

  const result = await client.search({
    index: "app-logs-*",
    size: 0,
    query: {
      bool: {
        must: [
          { term: { "service.keyword": service } },
          { term: { "level.keyword": level } },
          {
            range: {
              timestamp: {
                gte: from,
                lte: "now"
              }
            }
          }
        ]
      }
    }
  });

  return typeof result.hits.total === "number"
    ? result.hits.total
    : result.hits.total?.value || 0;
}
