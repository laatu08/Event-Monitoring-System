// import fetch from "node-fetch";
import { db } from "../db";
import { notificationChannels } from "../db/schema/notificationChannels";
import { eq } from "drizzle-orm";

export async function sendNotifications(payload: any) {
  const channels = await db
    .select()
    .from(notificationChannels)
    .where(eq(notificationChannels.enabled, true));

  for (const channel of channels) {
    if (channel.type === "webhook") {
      await sendWebhook(channel.target, payload);
    }
  }
}

async function sendWebhook(url: string, payload: any) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("❌ Webhook notification failed", err);
  }
}
