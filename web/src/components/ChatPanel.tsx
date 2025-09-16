import { useState } from "react";
import { askQA } from "../lib/api";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatPanel({ onTrendDetected }: {
    onTrendDetected: (coinId: string, days: number) => void;
}) {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [q, setQ] = useState("");

    async function send() {
        const input = q.trim();
        if (!input) return;
        setMsgs(m => [...m, { role: "user", text: input }]);
        setQ("");
        const res = await askQA(input);
        setMsgs(m => [...m, { role: "assistant", text: res.answer ?? "…" }]);

        // if backend sent series, reflect on chart
        if (res.series && Array.isArray(res.series)) {
            // crude parse: backend includes cgId in message body; extract from answer
            const cg = /trend for (\w+)/i.exec(res.answer || "")?.[1];
            const days = /(\d+)-day/i.exec(res.answer || "")?.[1];
            if (cg && days) onTrendDetected(cg, parseInt(days, 10));
        }
    }

    return (
        <div className="border border-gray-200 rounded-xl flex flex-col h-full bg-white shadow-sm">
            <div className="flex-1 p-4 space-y-3 overflow-auto min-h-[400px] max-h-[600px]">
                {msgs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Conversation</h3>
                    </div>
                ) : (
                    msgs.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] ${m.role === "user" ? "order-2" : "order-1"}`}>
                                {/* Message Avatar */}
                                <div className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {m.role === "user" ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${m.role === "user"
                                            ? "bg-blue-500 text-white rounded-br-md"
                                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white text-sm placeholder-gray-500"
                            placeholder="Ask about crypto trends, prices, or analysis..."
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            onKeyDown={e => (e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), send()) : null)}
                        />
                        {q && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setQ('')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <button
                        className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${q.trim()
                                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        onClick={send}
                        disabled={!q.trim()}
                    >
                        <div className="flex items-center gap-2">
                           Send
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
