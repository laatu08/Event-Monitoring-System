import client from "../lib/elastic";

export async function getErrorTrends(
  service: string,
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
          { term: { "service.keyword": service } }, // 🔥 FIX
          { terms: { "level.keyword": ["error", "fatal"] } }, // 🔥 FIX
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
    },
    aggs: {
      errors_over_time: {
        date_histogram: {
          field: "timestamp",
          fixed_interval: "1m"
        }
      }
    }
  });

  const buckets =
    (result.aggregations as any)?.errors_over_time?.buckets || [];

  return buckets
    .filter((b: any) => b.doc_count > 0)
    .map((b: any) => ({
      time: new Date(b.key).toISOString(),
      count: b.doc_count
    }));
}
