import { Redis } from "@upstash/redis";
export default async function handler(req, res) {
  try {
    const e = process.env, k = Object.keys(e);
    const url = e[k.find(n => /REST_(API_)?URL$/.test(n))];
    const token = e[k.find(n => /REST_(API_)?TOKEN$/.test(n))];
    const r = new Redis({ url, token });
    const id = req.body && req.body.id;
    if (!id) return res.status(400).json({ error: "no id" });
    await r.zadd("online", { score: Date.now(), member: id });
    await r.sadd("all_users", id);
    const online = await r.zcount("online", Date.now() - 60000, "+inf");
    res.json({ ok: true, online });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
}
