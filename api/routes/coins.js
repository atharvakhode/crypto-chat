import { Router } from "express";
import { prisma } from "../database/db.js";

const r = Router();

// GET /api/coins/top?limit=10
r.get("/top", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit ?? "10", 10), 50);
  const coins = await prisma.coin.findMany({
    orderBy: { marketCap: "desc" },
    take: limit
  });
  res.json(coins);
});

// GET /api/coins/:cgId/history?days=7|30
r.get("/:cgId/history", async (req, res) => {
  const { cgId } = req.params;
  const days = Math.min(parseInt(req.query.days ?? "30", 10), 365);
  const coin = await prisma.coin.findUnique({ where: { cgId } });
  if (!coin) return res.status(404).json({ error: "coin not found" });

  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const series = await prisma.price.findMany({
    where: { coinId: coin.id, ts: { gte: since } },
    orderBy: { ts: "asc" },
    select: { ts: true, price: true }
  });
  res.json({ cgId, series });
});

export default r;
