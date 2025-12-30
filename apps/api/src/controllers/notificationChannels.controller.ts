import { db } from "../db";
import { notificationChannels } from "../db/schema/notificationChannels";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
export async function listChannels(req: Request, res: Response) {
  const channels = await db.select().from(notificationChannels);
  res.json(channels);
}

export async function createChannel(req: Request, res: Response) {
  const { type, target } = req.body;

  const [channel] = await db
    .insert(notificationChannels)
    .values({ type, target })
    .returning();

  res.status(201).json(channel);
}

export async function toggleChannel(req: Request, res: Response) {
  const { id } = req.params;
  const { enabled } = req.body;

  await db
    .update(notificationChannels)
    .set({ enabled })
    .where(eq(notificationChannels.id, id));

  res.json({ status: "updated" });
}
