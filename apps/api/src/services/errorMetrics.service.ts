import client from "../lib/elastic";

function resolveRange(range: string) {
  const now = new Date();
  let from: Date;
  let interval: string;

  switch (range) {
    case "1h":
      from = new Date(now.getTime() - 60 * 60 * 1000);
      interval = "1m";
      break;

    case "24h":
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      interval = "5m";
      break;

    case "7d":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      interval = "1h";
      break;

    case "30d":
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      interval = "6h";
      break;

    case "3m":
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      interval = "1d";
      break;

    case "6m":
      from = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      interval = "1d";
      break;

    case "1y":
      from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      interval = "1w";
      break;

    default:
      throw new Error("Invalid range");
  }

  return { from, interval };
}

export async function countErrorsInWindow(
  service: string,
  windowMinutes: number
): Promise<number> {
  const from = new Date(
    Date.now() - windowMinutes * 60 * 1000
  ).toISOString();

  const res = await client.search({
    index: "app-logs-*",
    size: 0,
    query: {
      bool: {
        must: [
          { term: { "service.keyword": service } },
          { term: { "level.keyword": "error" } },
          {
            range: {
              timestamp: {
                gte: from
              }
            }
          }
        ]
      }
    }
  });

  return typeof res.hits.total === "number"
    ? res.hits.total
    : res.hits.total?.value || 0;
}

export async function getErrorTrends(
  service: string,
  range: string
) {
  // const from = new Date(
  //   Date.now() - windowMinutes * 60 * 1000
  // ).toISOString();

    const { from, interval } = resolveRange(range);

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
                gte: from.toISOString(),
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
          fixed_interval: interval,
          min_doc_count:0
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
