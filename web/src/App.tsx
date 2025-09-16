import { useState } from "react";
import CoinTable from "./components/CoinTable";
import TrendChart from "./components/TrendChart";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [selected, setSelected] = useState<string>("");
  const [days, setDays] = useState<number>(30);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Crypto Dashboard</h1>
          <p className="mt-2 text-gray-600">Track cryptocurrency trends and analyze market data</p>
        </div>
      </header>

      {/* Coin Table Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Market Overview</h2>
                <p className="text-gray-600">Select a cryptocurrency to view its trend analysis</p>
              </div>
              <CoinTable onSelect={(cgId) => { setSelected(cgId); setDays(30); }} />
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selected ? `${selected.toUpperCase()} Price Chart` : "Price Chart"}
                  </h2>
                  {selected && (
                    <p className="text-gray-600 mt-1">
                      {days} day trend analysis
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 mr-2">Period:</span>
                  {[7, 30].map(d => (
                    <button
                      key={d}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${days === d
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      onClick={() => setDays(d)}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>

              {selected ? (
                <TrendChart cgId={selected} days={days} />
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Select a cryptocurrency</p>
                    <p className="text-gray-500 text-sm">Choose from the table above to view price trends</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*Chat Assistant */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Chat Assistant</h2>
                <p className="text-gray-600">Ask questions about crypto trends and get insights</p>
              </div>
              <ChatPanel onTrendDetected={(cgId, d) => { setSelected(cgId); setDays(d); }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
