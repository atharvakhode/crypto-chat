import { fetchTopN, fetchMarketChart } from "./routes/coingecko.js";
import { prisma } from "./database/db.js";
import cron from "node-cron";

async function syncOnce() {
  const top = await fetchTopN(10);

  for (const c of top) {
    const coin = await prisma.coin.upsert({
      where: { cgId: c.id },
      update: {
        symbol: c.symbol,
        name: c.name,
        image: c.image,
        marketCap: c.market_cap ?? null,
        price: c.current_price ?? null,
        volume24h: c.total_volume ?? null,
        change24hPct: c.price_change_percentage_24h ?? null,
        lastSyncedAt: new Date()
      },
      create: {
        cgId: c.id,
        symbol: c.symbol,
        name: c.name,
        image: c.image,
        marketCap: c.market_cap ?? null,
        price: c.current_price ?? null,
        volume24h: c.total_volume ?? null,
        change24hPct: c.price_change_percentage_24h ?? null
      }
    });

    const hist = await fetchMarketChart(c.id, 30);
    const rows = hist.prices?.slice(-31) ?? []; // last ~30 data points
    for (const [ms, price] of rows) {
      const ts = new Date(ms);
      await prisma.price.upsert({
        where: { coinId_ts: { coinId: coin.id, ts } },
        update: { price },
        create: { coinId: coin.id, ts, price }
      });
    }
  }
}

export function scheduleSync() {
  syncOnce().catch((e) => console.error("initial sync error", e));
  cron.schedule("*/5 * * * *", () => syncOnce().catch(console.error));
}
