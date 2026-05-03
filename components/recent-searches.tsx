"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Hotel, Clock, Trash2, ArrowRight } from "lucide-react";
import { getSearchHistory, clearSearchHistory, timeAgo, type SearchEntry } from "@/lib/local-history";

export function RecentSearches() {
  const [history, setHistory] = useState<SearchEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getSearchHistory());
  }, []);

  // Don't render on server or if empty
  if (!mounted || history.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone" />
          <h2 className="font-display text-lg font-semibold text-ink">Recent Searches</h2>
        </div>
        <button
          onClick={() => { clearSearchHistory(); setHistory([]); }}
          className="flex items-center gap-1 text-stone text-xs hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <Link key={entry.id} href={entry.href}>
            <div className="bg-white rounded-xl border border-stone/10 px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-oxblood/20 transition-all group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                entry.type === "flight" ? "bg-blue-50" : "bg-emerald-50"
              }`}>
                {entry.type === "flight"
                  ? <Plane className="w-4 h-4 text-blue-600" />
                  : <Hotel className="w-4 h-4 text-emerald-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink text-sm font-medium truncate">{entry.label}</p>
                <p className="text-stone text-xs">{timeAgo(entry.savedAt)}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone/40 group-hover:text-oxblood group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
