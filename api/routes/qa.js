import { Router } from "express";
import { prisma } from "../database/db.js";
import { fetchSimplePrice } from "./coingecko.js";

const r = Router();

function normalize(s) {
  return (s || "").toLowerCase().replace(/[^\w\s\-\.]/g, " ").replace(/\s+/g, " ").trim();
}

// naive mapping 
const COIN_ALIASES = {
  bitcoin: ["btc", "bitcoin"],
  ethereum: ["eth", "ethereum"],
  tether: ["usdt"],
  ripple: ["xrp", "ripple"],
  cardano: ["ada", "cardano"]
};

function matchCoinId(q) {
  for (const [cgId, aliases] of Object.entries(COIN_ALIASES)) {
    if (aliases.some(a => q.includes(a))) return cgId;
  }
  return null;
}

r.post("/", async (req, res) => {
  const q = normalize(req.body?.query);
  if (!q) return res.json({ answer: "Please ask something like: 'price of bitcoin' or '7-day trend of ethereum'." });

  // intent detection (VERY simple)
  const wantTrend = /trend|chart|history|last\s*\d+\s*day|7[-\s]?day|30[-\s]?day/.test(q);
  const wantPrice = /price|quote|value|how much/.test(q);

  let days = 7;
  const m = q.match(/(\d+)\s*day/);
  if (m) days = Math.max(1, Math.min(parseInt(m[1], 10), 365));

  let cgId = matchCoinId(q);
  if (!cgId) {
    // try lookup by db symbol/name
    const coins = await prisma.coin.findMany();
    const found = coins.find(c =>
      q.includes(c.symbol.toLowerCase()) || q.includes(c.name.toLowerCase())
    );
    if (found) cgId = found.cgId;
  }

  if (!cgId) {
    return res.json({ answer: "I couldn't detect the coin. Try 'price of bitcoin' or '7-day trend of ethereum'." });
  }

  if (wantPrice && !wantTrend) {
    const data = await fetchSimplePrice(cgId);
    const vs = process.env.VS_CURRENCY || "usd";
    const price = data?.[cgId]?.[vs];
    if (price == null) return res.json({ answer: `Sorry, couldn't fetch ${cgId} price.` });
    const chg = data?.[cgId]?.[`${vs}_24h_change`];
    return res.json({
      answer: `${cgId}: ${price} ${vs.toUpperCase()} (${chg?.toFixed?.(2) ?? "0.00"}% 24h)`
    });
  }


  const coin = await prisma.coin.findUnique({ where: { cgId } });
  if (!coin) return res.json({ answer: "Coin not found in local DB yet. Wait for sync or open the dashboard top list once." });

  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const series = await prisma.price.findMany({
    where: { coinId: coin.id, ts: { gte: since } },
    orderBy: { ts: "asc" },
    select: { ts: true, price: true }
  });

  if (!series.length) return res.json({ answer: `No local data for last ${days} days yet.` });

  return res.json({
    answer: `Showing ${days}-day trend for ${cgId}.`,
    series
  });
});

export default r;
