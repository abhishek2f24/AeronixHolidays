"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

function PlanChat() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialQuery) handleSend(initialQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, thread_id: threadId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.thread_id) setThreadId(data.thread_id);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTIONS = [
    "Plan a 5-day Bali trip for 2 in June, budget $4,000",
    "Find business class flights from Delhi to London next month",
    "Best boutique hotels in Kyoto under $300/night",
    "Weekend trip from Mumbai — surprise me",
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen bg-cream">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone/10 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-oxblood/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-oxblood" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Ask Odin</h1>
          <p className="text-stone text-xs">Your AI travel agent</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-oxblood/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-oxblood" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink mb-2">Hello, I&apos;m Odin</h2>
            <p className="text-stone text-sm max-w-sm mx-auto mb-8">
              Tell me where you want to go and I&apos;ll plan the whole thing — flights, hotels, experiences.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left px-4 py-3 rounded-xl border border-stone/15 bg-white text-stone text-xs hover:border-oxblood hover:text-oxblood transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-oxblood flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-oxblood text-white rounded-tr-sm"
                  : "bg-white border border-stone/10 text-ink rounded-tl-sm shadow-sm"
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-stone/15 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-stone" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-oxblood flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-stone/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-stone/10 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Odin anything about your trip…"
            className="flex-1 h-11 rounded-xl border-stone/20 focus:border-oxblood"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-11 w-11 p-0 bg-oxblood hover:bg-oxblood/90 text-white rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return <Suspense><PlanChat /></Suspense>;
}
