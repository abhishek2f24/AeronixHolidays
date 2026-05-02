# aeronix holidays — Bootstrap MVP Plan (v2)

> **Last updated:** 2026-05-02  
> **Status:** Week 1 foundation complete. Ready for env vars + deployment.  
> **Rule:** If it doesn't directly cause a user to pay money, it doesn't get built yet.  
> **Read this file first every session to know what's done and what's next.**

---

## Stack (decided, don't re-debate)

| Layer | Tool | Cost |
|-------|------|------|
| Frontend + API | Next.js 16 on Vercel | $0 |
| Database + Auth | Supabase (free tier) | $0 |
| Payments | Razorpay (% only) | $0 fixed |
| AI (Odin) | Claude Haiku via Anthropic API | ~$5/mo for 20 users |
| Flights | Duffel API (free search, $0.80/booking) | $0 fixed |
| Hotels (MVP) | Booking.com affiliate redirect | $0 |
| Email | Resend free tier (3K/mo) | $0 |
| Analytics | Posthog free tier | $0 |
| Error tracking | Sentry free tier | $0 |
| **TOTAL** | | **~$5–14/mo** |

---

## Week 1 — Get money flowing (Days 1–7)

### D1: Project Setup
- [x] Initialize Next.js 16 project (TypeScript + Tailwind v4 + ESLint + App Router)
- [x] Install all dependencies (Supabase, Stripe, Duffel, Anthropic, Resend, shadcn)
- [x] Configure shadcn/ui with luxury design tokens (ink/ivory/oxblood palette)
- [x] Set up Cormorant Garamond + Inter fonts
- [x] Create `.env.local.example` (template for all env vars)
- [x] Create `.env.local` (placeholder values for build)

### D1: Database
- [x] Write 6-table SQL schema (`supabase/migrations/001_schema.sql`)
- [ ] **TODO: Create Supabase project at supabase.com**
- [ ] **TODO: Run `001_schema.sql` in Supabase SQL Editor**
- [ ] **TODO: Fill in real Supabase URL + anon key in `.env.local`**

### D2: Auth + Middleware
- [x] `lib/supabase/client.ts` — browser Supabase client
- [x] `lib/supabase/server.ts` — server Supabase client
- [x] `middleware.ts` — auth guard (protects /dashboard, /search, /plan, /trips, /concierge, /settings)
- [x] `app/auth/callback/route.ts` — OAuth + magic link callback handler
- [x] `app/(auth)/sign-in/page.tsx` — email magic link + Google OAuth
- [x] `app/(auth)/sign-up/page.tsx` — email magic link + Google OAuth

### D2: Landing Page
- [x] `components/navigation.tsx` — transparent on hero, solid on scroll
- [x] `components/search-widget.tsx` — 5 tabs: Ask Odin (AI) / Flights / Hotels / Holidays / Experiences
- [x] `app/page.tsx` — full landing page (hero, value props, destinations, pricing preview, testimonials, footer)

- [ ] **TODO: Fill in Razorpay keys in `.env.local`**

### D4: Member Dashboard
- [x] `app/(member)/layout.tsx` — sidebar nav (protected, server-side auth check)
- [x] `app/(member)/dashboard/page.tsx` — full member home (greeting, search widget, trips, concierge, inspiration)

### D5: Travel DNA Quiz
- [x] `app/(member)/onboarding/page.tsx` — 6-step quiz saved to Supabase `travel_dna` JSONB column

### D6: AI Chat (Odin)
- [x] `lib/ai.ts` — lazy Anthropic client + system prompt
- [x] `app/api/ai/chat/route.ts` — Claude Haiku with search_flights + search_hotels tool use, messages stored in `ai_threads`
- [x] `app/(member)/plan/page.tsx` — full chat UI with suggestions, streaming-style response

### D6: Concierge
- [x] `lib/resend.ts` — lazy Resend client
- [x] `app/api/concierge/route.ts` — saves to Supabase + emails founder
- [x] `app/(member)/concierge/page.tsx` — request form with category picker + SLA display

### D7: Flight Search
- [x] `lib/duffel.ts` — lazy Duffel client
- [x] `app/api/search/flights/route.ts` — Duffel offer request proxy

### BUILD STATUS
- [x] `npm run build` passes cleanly (TypeScript + compilation)

---

## Phase 1 — Flight & Hotel Metasearch (Model A)
- [x] **D1–D7:** Foundation & UI (Complete)
- [/] **D8–D14:** Metasearch Optimization
    - [x] Build `app/search/page.tsx` — Comparison UI (Complete)
    - [ ] Implement redirect logic to OTA/Airline partners
    - [ ] Add real affiliate APIs (Amadeus/Skyscanner)
    - [ ] Build flight filters (price range, stops, departure time)
- [ ] **D15–D21:** Affiliate & Notifications
    - [ ] Integration with affiliate deep-links
    - [ ] Price alerts (Email/Push)
    - [ ] Simple `/admin` to track lead clicks
- [ ] **D22–D30:** Content & Polish
    - [ ] 3 SEO destination pages (`/destinations/bali`, `/destinations/paris`, `/destinations/maldives`)
    - [ ] OG image & SEO optimization
    - [ ] Deploy to Vercel production

## Phase 2 — Full OTA Booking Engine (Model B)
> Implement ONLY after Model A is profitable and regulated.
- [ ] GDS contracts & Ticketing agreements
- [ ] Payment reconciliation & PNR handling
- [ ] Refund management flow
- [ ] Full hotel booking engine (Expedia Rapid API)
- [ ] Disruption recovery automation (FlightAware API)

---

## Files Created This Session

```
aeronixholidays/
├── app/
│   ├── page.tsx                          ✅ Landing page (full)
│   ├── pricing/page.tsx                  ✅ Pricing page
│   ├── layout.tsx                        ✅ Root layout (fonts, metadata)
│   ├── globals.css                       ✅ Design tokens (ink/ivory/oxblood)
│   ├── (auth)/
│   │   ├── sign-in/page.tsx              ✅
│   │   └── sign-up/page.tsx              ✅
│   ├── (member)/
│   │   ├── layout.tsx                    ✅ Sidebar nav (protected)
│   │   ├── dashboard/page.tsx            ✅ Member home
│   │   ├── onboarding/page.tsx           ✅ Travel DNA quiz (6 steps)
│   │   ├── plan/page.tsx                 ✅ Odin AI chat
│   │   └── concierge/page.tsx            ✅ Concierge request form
│   ├── auth/callback/route.ts            ✅ OAuth callback
│   └── api/
│       ├── stripe/checkout/route.ts      ✅
│       ├── stripe/webhook/route.ts       ✅
│       ├── stripe/portal/route.ts        ✅
│       ├── search/flights/route.ts       ✅ Duffel proxy
│       ├── ai/chat/route.ts              ✅ Claude Haiku + tool use
│       └── concierge/route.ts            ✅ Email to founder
├── components/
│   ├── navigation.tsx                    ✅ Transparent → solid on scroll
│   └── search-widget.tsx                 ✅ 5 tabs (Odin/Flights/Hotels/Holidays/Experiences)
├── lib/
│   ├── supabase/client.ts                ✅
│   ├── supabase/server.ts                ✅
│   ├── stripe.ts                         ✅
│   ├── duffel.ts                         ✅
│   ├── ai.ts                             ✅
│   └── resend.ts                         ✅
├── middleware.ts                          ✅ Auth route guard
├── supabase/migrations/001_schema.sql    ✅ 6-table schema
├── .env.local.example                    ✅ Env var template
├── .env.local                            ✅ Placeholder values (BUILD ONLY)
└── PLAN_v2.md                            ✅ This file
```

---

## To Run Locally Right Now

```bash
# 1. Copy .env.local.example → .env.local and fill in real values
# 2. Run the SQL migration in Supabase dashboard
npm run dev
# → http://localhost:3000
```

---

## Revenue Targets

| Week | Goal | MRR |
|------|------|-----|
| Week 4 | 5 Atlas sign-ups | $245 |
| Month 2 | 15 Atlas + 2 Odyssey | $1,535 |
| Month 3 | 30 Atlas + 5 Odyssey | $3,440 |
| Month 6 | 100 Atlas + 10 Odyssey | $8,800 |

---

## Changelog & Decisions

### 2026-05-02: Adopted Model A (Metasearch) Strategy
- **Decision:** Prioritize Flight Metasearch over Full OTA to minimize regulatory and technical overhead.
- **Action:** Updated roadmap to focus on search comparison and affiliate redirection.
- **Architecture:** Search results will now lead to external partner redirects instead of internal checkout.

