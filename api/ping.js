import { Redis } from "@upstash/redis";
export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    const r = new Redis({ url, token });
    const id = req.body && req.body.id;
    if (!id) return res.status(400).json({ error: "no id" });
    await r.zadd("online", { score: Date.now(), member: id });
    await r.sadd("all_users", id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
