import { Redis } from "@upstash/redis";
export default async function handler(req, res) {
  try {
    if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY)
      return res.status(401).json({ error: "unauthorized (ADMIN_KEY ខុស ឬមិនទាន់ដាក់)" });
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token)
      return res.status(500).json({ error: "មិនទាន់ភ្ជាប់ Redis ទៅ project នេះ" });
    const r = new Redis({ url, token });
    const online = await r.zcount("online", Date.now() - 60000, "+inf");
    const total = await r.scard("all_users");
    res.json({ online, total });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
