import { Redis } from "@upstash/redis";

/**
 * Booked-slot storage.
 * - Production: Upstash Redis (Vercel Marketplace integration). A slot is claimed
 *   with SET NX so two customers can never book the same hour.
 * - Local dev without credentials: in-memory fallback (resets on restart).
 */

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;
export const storeConfigured = Boolean(redis);

const memory = new Map<string, string>();
const TTL_SECONDS = 60 * 60 * 24 * 150; // keep records ~5 months

const slotKey = (date: string, hour: number) => `pl:slot:${date}:${hour}`;
const dayKey = (date: string) => `pl:day:${date}`;

export async function getBookedHours(date: string): Promise<number[]> {
  if (redis) {
    const members = await redis.smembers(dayKey(date));
    return members.map(Number).filter((n) => Number.isInteger(n)).sort((a, b) => a - b);
  }
  const prefix = `pl:slot:${date}:`;
  return [...memory.keys()].filter((k) => k.startsWith(prefix)).map((k) => Number(k.slice(prefix.length))).sort((a, b) => a - b);
}

/** Atomically claim a slot. Returns false if it was already taken. */
export async function claimSlot(date: string, hour: number, bookingJson: string): Promise<boolean> {
  if (redis) {
    const ok = await redis.set(slotKey(date, hour), bookingJson, { nx: true, ex: TTL_SECONDS });
    if (ok !== "OK") return false;
    await redis.sadd(dayKey(date), String(hour));
    await redis.expire(dayKey(date), TTL_SECONDS);
    return true;
  }
  const k = slotKey(date, hour);
  if (memory.has(k)) return false;
  memory.set(k, bookingJson);
  return true;
}

/** Undo a claim (used if the notification email fails). */
export async function releaseSlot(date: string, hour: number): Promise<void> {
  if (redis) {
    await redis.del(slotKey(date, hour));
    await redis.srem(dayKey(date), String(hour));
    return;
  }
  memory.delete(slotKey(date, hour));
}
