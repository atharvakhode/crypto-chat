import { useEffect, useState } from "react";
import { getHistory } from "../lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TrendChart({ cgId, days = 30 }:{ cgId: string; days?: number }) {
  const [data, setData] = useState<{ ts: string; price: number }[]>([]);

  useEffect(() => {
    if (!cgId) return;
    getHistory(cgId, days).then((d) => {
      const mapped = d.series.map((p: any) => ({
        ts: new Date(p.ts).toLocaleDateString(),
        price: p.price
      }));
      setData(mapped);
    });
  }, [cgId, days]);

  if (!cgId) return <div className="p-4 text-gray-600">Select a coin to view trend</div>;
  if (!data.length) return <div className="p-4">Loading trend…</div>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="ts" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
