// Lazy factory — never instantiated at module load (avoids build-time errors)
export function getAmadeus() {
  // @ts-ignore — amadeus has no TS types bundle, use require
  const Amadeus = require("amadeus");
  return new Amadeus({
    clientId:     process.env.AMADEUS_CLIENT_ID!,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
    hostname:     process.env.AMADEUS_ENV === "production" ? "production" : "test",
  });
}

/* ── Shared formatters ── */

export function formatDuration(iso: string): string {
  // PT2H15M → "2h 15m"
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}h ` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return `${h}${m}`.trim();
}

export function formatTime(dateTime: string): string {
  // "2026-06-01T06:35:00" → "06:35"
  return dateTime.split("T")[1]?.slice(0, 5) ?? dateTime;
}

export function formatINR(amount: string | number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/* ── Airline name map (Indian + major international carriers) ── */
export const AIRLINE_NAMES: Record<string, string> = {
  "6E": "IndiGo",
  AI:   "Air India",
  UK:   "Vistara",
  SG:   "SpiceJet",
  G8:   "GoAir",
  I5:   "AirAsia India",
  QP:   "Akasa Air",
  S5:   "Star Air",
  "2T": "TruJet",
  EK:   "Emirates",
  QR:   "Qatar Airways",
  EY:   "Etihad",
  SQ:   "Singapore Airlines",
  BA:   "British Airways",
  LH:   "Lufthansa",
  AF:   "Air France",
  AA:   "American Airlines",
  UA:   "United Airlines",
  TK:   "Turkish Airlines",
  WY:   "Oman Air",
  KL:   "KLM",
};
