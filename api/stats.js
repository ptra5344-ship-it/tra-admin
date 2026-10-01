import { Redis } from "@upstash/redis";
const r = Redis.fromEnv();
export default async function handler(req, res) {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: "unauthorized" });
  const online = await r.zcount("online", Date.now() - 60000, "+inf");
  const total = await r.scard("all_users");
  res.json({ online, total });
}
