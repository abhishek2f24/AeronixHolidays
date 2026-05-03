/**
 * localStorage-based search history and pending booking.
 * Works for both guests and logged-in users.
 * No DB migration required.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface SearchEntry {
  id:       string;
  type:     "flight" | "hotel";
  label:    string;   // "DEL → LHR · 10 May" | "Dubai · 10–15 May"
  href:     string;   // Full /search?... URL to re-trigger
  savedAt:  string;   // ISO date string
}

export interface PendingBooking {
  type:       "flight" | "hotel";
  label:      string;   // "IndiGo BOM→LHR ₹3,900" | "Leela Palace, Delhi"
  partnerUrl: string;   // The Skyscanner / Booking.com URL
  searchHref: string;   // Back to Aeronix search results
  savedAt:    string;
}

// ── Keys ─────────────────────────────────────────────────────────────────────

const HISTORY_KEY = "aeronix_search_history";
const PENDING_KEY = "aeronix_pending_booking";
const MAX_HISTORY = 5;
const PENDING_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// ── Helpers ───────────────────────────────────────────────────────────────────

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function remove(key: string) {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch {}
}

// ── Search History ────────────────────────────────────────────────────────────

export function saveSearch(entry: Omit<SearchEntry, "id" | "savedAt">) {
  const existing = getSearchHistory();
  const next: SearchEntry = {
    ...entry,
    id:      Date.now().toString(),
    savedAt: new Date().toISOString(),
  };
  // Deduplicate by href, keep newest
  const deduped = [next, ...existing.filter(e => e.href !== entry.href)].slice(0, MAX_HISTORY);
  write(HISTORY_KEY, deduped);
}

export function getSearchHistory(): SearchEntry[] {
  return read<SearchEntry[]>(HISTORY_KEY) ?? [];
}

export function clearSearchHistory() {
  remove(HISTORY_KEY);
}

// ── Pending Booking ───────────────────────────────────────────────────────────

export function savePendingBooking(booking: Omit<PendingBooking, "savedAt">) {
  write(PENDING_KEY, { ...booking, savedAt: new Date().toISOString() });
}

export function getPendingBooking(): PendingBooking | null {
  const b = read<PendingBooking>(PENDING_KEY);
  if (!b) return null;
  // Auto-expire after 2 hours
  if (Date.now() - new Date(b.savedAt).getTime() > PENDING_TTL_MS) {
    clearPendingBooking();
    return null;
  }
  return b;
}

export function clearPendingBooking() {
  remove(PENDING_KEY);
}

// ── Relative time helper ──────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
