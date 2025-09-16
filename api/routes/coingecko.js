import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.COINGECKO_BASE;
const VS = process.env.VS_CURRENCY || "usd";

// Top N markets
export async function fetchTopN(n = 10) {
  const url = `${BASE}/coins/markets`;
  const { data } = await axios.get(url, {
    params: {
      vs_currency: VS,
      order: "market_cap_desc",
      per_page: n,
      page: 1,
      price_change_percentage: "24h"
    },
    timeout: 10000
  });
  return data; 
}

// 30d history for a coin id
export async function fetchMarketChart(coinId, days = 30) {
  const url = `${BASE}/coins/${coinId}/market_chart`;
  const { data } = await axios.get(url, {
    params: { vs_currency: VS, days, interval: "daily" },
    timeout: 10000
  });
  return data; 
}

// price for QA
export async function fetchSimplePrice(idsCsv) {
  const url = `${BASE}/simple/price`;
  const { data } = await axios.get(url, {
    params: {
      ids: idsCsv,
      vs_currencies: VS,
      include_24hr_change: true,
      include_last_updated_at: true
    },
    timeout: 10000
  });
  return data;
}
