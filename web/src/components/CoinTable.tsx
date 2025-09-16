import { useEffect, useState } from "react";
import { getTopCoins } from "../lib/api";

type Coin = {
  cgId: string; symbol: string; name: string;
  price: number | null; change24hPct: number | null;
  volume24h: number | null; image?: string | null;
};

export default function CoinTable({ onSelect }: { onSelect: (cgId: string)=>void }) {
  const [rows, setRows] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopCoins(10).then(setRows).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading top coins…</div>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th>Coin</th><th>Price (USD)</th><th>24h %</th><th>Volume</th>
        </tr>
      </thead>
      <tbody>
      {rows.map(r => (
        <tr key={r.cgId} className="border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(r.cgId)}>
          <td className="py-2 flex items-center gap-2">
            {r.image && <img src={r.image} className="w-5 h-5" />}
            {r.name} <span className="text-gray-500 uppercase">({r.symbol})</span>
          </td>
          <td>{r.price?.toLocaleString() ?? "-"}</td>
          <td className={((r.change24hPct ?? 0) >= 0) ? "text-green-600" : "text-red-600"}>
            {r.change24hPct?.toFixed(2) ?? "-"}%
          </td>
          <td>{r.volume24h ? r.volume24h.toLocaleString() : "-"}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
