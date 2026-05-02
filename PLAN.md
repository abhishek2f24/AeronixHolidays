# aeronix holidays — Master Implementation Plan

> **Last updated:** 2026-05-02  
> **Status:** Pre-development (0% complete)  
> **Target:** Production launch → private beta in 30 days, public in 90 days  
> **Tick `[x]` as each task is completed. Read this file at start of every session for full context.**

---

## Decision Log — Best-of-All-Plans Choices

| Dimension | Choice | Source | Reason |
|-----------|--------|---------|--------|
| Architecture | Turborepo monorepo | Claude | Best DX, shared packages, incremental builds |
| Web framework | Next.js 15 + React 19 + App Router | Claude | RSC, streaming, ISR for SEO pages |
| Styling | Tailwind v4 + shadcn + Framer Motion | Claude | Most modern, design system ready |
| Mobile | Expo + RN 0.79 + tamagui | Claude | iOS-first, native performance |
| Backend (booking/payments) | NestJS + Saga pattern | Claude | Enterprise saga, compensations, idempotency |
| Backend (search/pricing) | Go microservices | Claude | Hot path performance, low latency |
| AI runtime | Python 3.12 + FastAPI + LangGraph + CrewAI | Claude | Best multi-agent orchestration |
| AI model | Claude (primary) + GPT-4 (fallback) | Claude | Best reasoning, tool use |
| Database | PostgreSQL 16 + pgvector + Redis 7 | Claude | Vectors for DNA matching, caching |
| Search | Elasticsearch 8 + Meilisearch | Claude | Inventory search + full-text |
| Queue | Kafka (MSK) + BullMQ for simple jobs | Claude+DS | Kafka for events, BullMQ for jobs |
| Payments | Stripe (global) + Razorpay (India) + Adyen | Claude+DS | Multi-gateway coverage |
| Auth | Auth0 OTP + OAuth + Passkeys | Claude | Fastest to launch, enterprise-grade |
| Infra | AWS EKS + Terraform + Argo CD | Claude | Production scale, GitOps |
| Observability | Datadog + OTel + Sentry | Claude | Full stack observability |
| Group travel | Invite + vote + split payments | DeepSeek | Social differentiation |
| Fare lock | Price hold before payment | DeepSeek | Reduces drop-off, key India feature |
| Refund tracking | Transparent state machine | ChatGPT | Trust + support load reduction |
| Corporate travel | Policy engine + approvals + GST | ChatGPT | B2B2C moat |
| SEO | Destination pages + editorial content | ChatGPT | Organic acquisition |
| Price prediction | "Buy now / wait" model | DeepSeek | AI differentiation |

---

## Business Model

| Tier | Price | Key Features |
|------|-------|-------------|
| **Voyager** | Free | 3 AI turns/day, standard booking, search |
| **Atlas** | $480/yr ($49/mo) | Unlimited Odin AI, hotel perks, 0% FX virtual card, priority chat, 4 CFAR/yr |
| **Odyssey** | $4,800/yr | All Atlas + named Trip Designer, 24/7 disruption pod, DragonPass lounges, $300 transfer credit |
| **Corporate** | Custom | Org management, policy engine, GST invoices, Slack agent, expense reconciliation |

Take-rate target: 15–22% on bookings. MRR target: $25K by Day 90.

---

## Monorepo Structure

```
aeronixholidays/
├── apps/
│   ├── web/              ← Next.js 15 consumer app
│   ├── admin/            ← Next.js 15 admin CMS
│   ├── mobile/           ← Expo + RN 0.79
│   └── agent-runtime/    ← Python FastAPI + LangGraph
├── services/
│   ├── identity-svc/     ← NestJS: auth, OTP, passkeys, sessions
│   ├── dna-svc/          ← NestJS: travel DNA, profile, preferences
│   ├── search-svc/       ← Go: flight + hotel + experience search
│   ├── pricing-svc/      ← Go: dynamic pricing, fare lock, prediction
│   ├── booking-svc/      ← NestJS: saga orchestrator, state machine
│   ├── payment-svc/      ← NestJS: Stripe + Razorpay + Adyen
│   ├── notification-svc/ ← NestJS: email + push + SMS + WhatsApp
│   ├── concierge-svc/    ← NestJS: tickets, SLA, human handoff
│   ├── loyalty-svc/      ← NestJS: points, referrals, tiers
│   ├── disruption-svc/   ← NestJS: FlightAware, rebook engine
│   ├── supplier-svc/     ← NestJS: adapter registry, inventory cache
│   ├── corporate-svc/    ← NestJS: orgs, policies, expense claims
│   ├── analytics-svc/    ← NestJS: event ingestion, Segment proxy
│   ├── content-svc/      ← NestJS: CMS, destination pages, journals
│   └── fraud-svc/        ← NestJS: risk scoring, KYC hooks
├── packages/
│   ├── ui/               ← Shared React components (luxury design system)
│   ├── config/           ← ESLint, TSConfig, shared env validation
│   ├── db/               ← Prisma schema + Drizzle for Go services
│   ├── agent-tools/      ← Typed MCP tool definitions
│   └── events/           ← Avro/Protobuf event schemas (Kafka)
└── infra/
    ├── terraform/        ← AWS EKS, RDS, ElastiCache, MSK, S3, CloudFront
    ├── k8s/              ← Kubernetes manifests + Helm charts
    └── github-actions/   ← CI/CD pipelines
```

---

## PHASE 0 — Project Foundation
> Target: Day 1–3 | Priority: BLOCKING everything else

### 0.1 Repository Setup
- [ ] Initialize Git repo at `aeronixholidays/`
- [ ] Set up Turborepo (`pnpm` workspaces + `turbo.json`)
- [ ] Configure TypeScript 5 base tsconfig in `packages/config`
- [ ] Configure ESLint + Prettier + Husky + lint-staged
- [ ] Add `.env.example` with all required env vars documented
- [ ] Set up `.nvmrc` (Node 22 LTS)
- [ ] Initialize `pnpm-workspace.yaml`

### 0.2 AWS Infrastructure (Terraform)
- [ ] Create Terraform project in `infra/terraform/`
- [ ] Provision VPC + subnets (us-east-1 primary)
- [ ] Provision EKS cluster (Karpenter for auto-scaling)
- [ ] Provision RDS PostgreSQL 16 Multi-AZ
- [ ] Provision ElastiCache Redis 7 cluster
- [ ] Provision MSK Kafka cluster (3 brokers)
- [ ] Provision S3 buckets (assets, uploads, backups)
- [ ] Configure CloudFront distribution + ACM SSL
- [ ] Configure Route53 hosted zone + DNS records
- [ ] Set up KMS keys for data at rest
- [ ] Configure WAF rules (OWASP top 10)
- [ ] Set up ECR repositories for all services

### 0.3 CI/CD Pipeline
- [ ] Create GitHub Actions workflows in `infra/github-actions/`
- [ ] PR pipeline: lint → typecheck → unit tests → build
- [ ] Deploy pipeline: Docker build → ECR push → Argo CD sync
- [ ] Set up Argo CD on EKS for GitOps
- [ ] Configure Kubernetes namespaces (staging, production)
- [ ] Add Datadog agent to cluster
- [ ] Add Sentry DSN to all services

### 0.4 Database Schema
- [ ] Create Prisma schema in `packages/db/`
- [ ] Run initial migration for all tables (see SQL schema section below)
- [ ] Add pgvector extension for DNA embeddings
- [ ] Seed enum types: `membership_tier`, `booking_status`
- [ ] Create database indexes (email, phone, booking status, created_at)
- [ ] Set up database connection pooling (PgBouncer)
- [ ] Create read replicas for search/analytics queries

### 0.5 Auth Setup (Auth0)
- [ ] Create Auth0 tenant + application
- [ ] Configure OTP (SMS via Twilio) + email magic link
- [ ] Configure OAuth providers: Google, Apple, Microsoft
- [ ] Configure Passkey (WebAuthn) support
- [ ] Set up Auth0 Actions for post-login user sync
- [ ] Create JWT validation middleware for all services
- [ ] Set up RBAC roles: voyager, atlas, odyssey, admin, concierge, support

### 0.6 Stripe Billing
- [ ] Create Stripe products: Voyager (free), Atlas ($480/yr, $49/mo), Odyssey ($4,800/yr)
- [ ] Set up Stripe webhook endpoint + secret verification
- [ ] Create subscription management flows (create, upgrade, cancel)
- [ ] Configure Stripe Tax for global tax collection
- [ ] Set up Stripe Customer Portal for self-service billing
- [ ] Test Atlas → Odyssey upgrade proration
- [ ] Test downgrade + cancellation grace period

---

## PHASE 1 — Web Application (Consumer)
> Target: Day 3–14 | Apps: `apps/web/`

### 1.1 Design System
- [ ] Configure Tailwind v4 with custom design tokens
- [ ] Typography: GT Sectra Display (headings) + Inter (body)
- [ ] Color palette: ink `#1a1510`, ivory `#f5f2eb`, oxblood `#6b1f2a`, stone `#8c8680`
- [ ] Set up shadcn/ui with custom theme overrides
- [ ] Create Storybook for all shared components
- [ ] Build `packages/ui`: Button, Input, Card, Dialog, Badge, Avatar, DataTable
- [ ] Dark mode default with warm-ink contrast (editorial)
- [ ] Mobile-first responsive breakpoints

### 1.2 Landing Page
- [ ] Hero: full-bleed cinematic video loop, serif value prop, single CTA
- [ ] Value prop trio (Plan in minutes / Sleep through disruption / Curators on retainer)
- [ ] Membership ladder visual (Voyager / Atlas / Odyssey)
- [ ] Social proof section (member quotes, press logos)
- [ ] "As featured in" logos (Skift, Phocuswire, Condé Nast Traveler)
- [ ] Footer with legal links, social, newsletter signup
- [ ] SEO meta tags + structured data (Organization schema)
- [ ] Page speed optimization (target: Core Web Vitals all green)

### 1.3 Auth Flows
- [ ] Sign up page (email OTP + phone OTP)
- [ ] OAuth login (Google / Apple)
- [ ] Passkey registration + authentication
- [ ] Magic link email flow
- [ ] Session management (JWT refresh + rotation)
- [ ] Protected routes middleware (App Router)
- [ ] Onboarding redirect after first login → DNA quiz

### 1.4 Travel DNA Quiz
- [ ] 8-step onboarding quiz: cabin preference, hotel star min, vibe tags, budget band, dietary, family unit, sustainability weight, home airport
- [ ] Progressive disclosure (one question per screen)
- [ ] Save to `travel_dna` table + generate pgvector embedding
- [ ] Show personalized "Welcome to aeronix holidays" page after quiz
- [ ] Allow skip + fill later from profile settings

### 1.5 Search Interface
- [ ] Search bar: intent modes (flights, hotels, experiences, transfers, packages)
- [ ] Flight search: origin/destination autocomplete (IATA codes), dates, cabin, passengers
- [ ] Hotel search: destination, check-in/out, guests, star rating
- [ ] Experience search: destination, date, category, group size
- [ ] Transfer search: pickup, dropoff, date/time, vehicle type
- [ ] Package search: destination, duration, budget
- [ ] Search results: editorial cards (3 desktop / 1 mobile), no yellow banners
- [ ] Filters sidebar: price, duration, airline, star rating, free cancellation
- [ ] Sort options: price, recommended (DNA-matched), departure time
- [ ] Fare lock button on flight cards (price hold for 24-72h)
- [ ] Compare drawer: shortlist up to 4 options

### 1.6 Hotel Detail Page
- [ ] Oversized photography gallery (full-bleed)
- [ ] Vertical-scroll narrative (description, amenities, location)
- [ ] Rate calendar with availability
- [ ] Room type selection
- [ ] Hotel perks display (Atlas/Odyssey: upgrade, credit, late checkout)
- [ ] Sticky concierge CTA sidebar
- [ ] Reviews section with sentiment tags
- [ ] Map embed (Mapbox)

### 1.7 Checkout Flow
- [ ] Step-by-step overlay modal (not page reload)
- [ ] Traveler details form (passenger info, passport)
- [ ] Seat selection (flight)
- [ ] Add-ons: travel insurance, lounge access, transfers
- [ ] Payment: saved cards, new card, Stripe Link, UPI (India)
- [ ] Fare lock option (pay $X to hold price, deduct on full payment)
- [ ] Part payment (pay 30% now, rest 7 days before departure)
- [ ] Order review + fee breakdown (no hidden fees)
- [ ] Booking confirmation page + email

### 1.8 Member Dashboard
- [ ] Odin chat input (top of dashboard)
- [ ] Next-trip card with Apple Wallet pass link
- [ ] Calendar gap detector ("4-day gap Oct 11–14, 5 trips fit your DNA")
- [ ] Sunday Inspiration drop (3 editorial cards, refreshed weekly)
- [ ] Trip Bank (banked nights, credits, loyalty points)
- [ ] Concierge button (green = available, shows queue position)
- [ ] Disruption alerts (empty state: "All clear", else red banner)
- [ ] "My Trips" timeline (upcoming + past)

### 1.9 Trip Detail Page
- [ ] Full itinerary timeline (day-by-day)
- [ ] Booking segments (flights, hotels, transfers)
- [ ] E-ticket download (PDF)
- [ ] Modification + cancellation actions
- [ ] Refund tracker (transparent state machine: initiated → processing → done)
- [ ] Support ticket creation from trip context
- [ ] Share itinerary link (public + private modes)
- [ ] Trip journal (markdown editor)

### 1.10 Itinerary Planner
- [ ] Split-pane: Odin chat (left), day-by-day timeline (right), map (below)
- [ ] Drag-and-drop day reordering
- [ ] Add segments: flight, hotel, experience, transfer, restaurant, note
- [ ] Auto-populate from Odin suggestions
- [ ] Budget tracker (running total vs. target)
- [ ] Share planner link for group co-planning

### 1.11 Group Trip Features
- [ ] "Plan with friends" entry point from itinerary planner
- [ ] Create group trip: name, destination, dates, invite code
- [ ] Invite link (sharable URL + QR code)
- [ ] Member voting on hotel options (thumbs up/down)
- [ ] Group chat thread (in-app)
- [ ] Expense breakdown per member
- [ ] Split payment request (email/WhatsApp members to pay their share)

### 1.12 Membership & Billing
- [ ] Pricing page (Voyager / Atlas / Odyssey comparison table)
- [ ] Upgrade flow (Stripe Checkout → redirect back)
- [ ] Downgrade flow with grace period messaging
- [ ] Billing history page
- [ ] Invoice download (PDF)
- [ ] Payment method management (add, set default, remove)
- [ ] Atlas/Odyssey benefit showcase page

### 1.13 Profile & Settings
- [ ] Edit profile (name, photo, locale, timezone)
- [ ] Travel DNA edit (re-take quiz)
- [ ] Passport management (add, edit, delete, primary flag)
- [ ] Loyalty links (Plaid connect for existing hotel/airline accounts)
- [ ] Notification preferences (email, push, WhatsApp)
- [ ] GDPR controls (data export DSAR, delete account)
- [ ] Connected accounts (Google, Apple OAuth)
- [ ] Referral code + share link

### 1.14 SEO Destination Pages
- [ ] Destination page template (`/destinations/[slug]`)
- [ ] 50 initial destination pages (top travel markets)
- [ ] Structured data (TouristDestination schema)
- [ ] Internal linking from search results
- [ ] Editorial content (best time to visit, aeronix holidays picks)
- [ ] Hotel + flight price widgets (live data)
- [ ] `/sitemap.xml` auto-generation
- [ ] OpenGraph + Twitter card meta per destination

---

## PHASE 2 — Backend Services
> Target: Day 1–21 | Services: `services/`

### 2.1 Identity Service (`identity-svc`)
- [ ] NestJS application setup + OpenAPI docs
- [ ] OTP generation + Twilio SMS delivery
- [ ] Email magic link (SendGrid)
- [ ] Auth0 token validation middleware
- [ ] Passkey (WebAuthn) registration + authentication
- [ ] Session store in Redis (refresh token rotation)
- [ ] User CRUD (`users` + `profiles` tables)
- [ ] Consent log on registration (GDPR)

### 2.2 DNA Service (`dna-svc`)
- [ ] Travel DNA save/update endpoint
- [ ] pgvector embedding generation (OpenAI text-embedding-3-large)
- [ ] DNA similarity search (cosine distance) for recommendations
- [ ] Household management (add members, set primary)
- [ ] Passport CRUD with encryption at rest

### 2.3 Search Service (`search-svc`) — Go
- [ ] Go module with Echo framework + OpenAPI spec
- [ ] Flight search adapter interface `IFlightAdapter`
- [ ] Duffel adapter (primary NDC source)
- [ ] Expedia Rapid adapter for hotels
- [ ] Viator adapter for experiences
- [ ] Blacklane adapter for transfers
- [ ] Elasticsearch indexing for hotel inventory
- [ ] Redis cache for hot routes (5-min TTL for flights, 30-min for hotels)
- [ ] Rate limiter (100 req/min per user, 1000/min per IP)
- [ ] Meilisearch for destination + property full-text search

### 2.4 Pricing Service (`pricing-svc`) — Go
- [ ] Dynamic pricing engine
- [ ] Fare lock: `POST /v1/fare-locks` → stores price + expiry in Redis
- [ ] Fare lock release (TTL expiry + manual release)
- [ ] Price prediction model (LightGBM via Python sidecar): "buy now / wait" + confidence %
- [ ] Markup rules by tier (Atlas/Odyssey get better rates via supplier contracts)
- [ ] FX rate feed (ECB + Wise)
- [ ] Price alert storage + trigger evaluation (BullMQ cron)

### 2.5 Booking Service (`booking-svc`) — NestJS Saga
- [ ] Booking state machine: `held → confirmed → partially_canceled → canceled → completed → disputed`
- [ ] Multi-leg saga: hold seat → hold room → charge → confirm → emit `booking.created`
- [ ] Compensating transactions: release seat, release room, refund
- [ ] Idempotency keys on every external call (Redis, 24h TTL)
- [ ] Outbox pattern via Kafka transactional messages
- [ ] Canonical OrderID (PNR-independent, UUID v7)
- [ ] Flight booking via Duffel (search → offer selection → order creation)
- [ ] Hotel booking via Expedia Rapid (availability → book → confirm)
- [ ] Experience booking via Viator
- [ ] Transfer booking via Blacklane
- [ ] 90% line coverage + property-based tests on compensation paths
- [ ] OpenAPI 3.1 spec

### 2.6 Payment Service (`payment-svc`)
- [ ] Stripe integration: payment intents, setup intents, subscriptions
- [ ] Razorpay integration: orders, UPI, EMI
- [ ] Adyen integration (enterprise/corporate cards)
- [ ] PCI DSS: no raw PAN stored, tokenization only
- [ ] Idempotency keys (store in Redis, 24h TTL)
- [ ] Webhook handlers: Stripe, Razorpay, Adyen (signature verification)
- [ ] Split payment: partial charge + schedule remaining (BullMQ cron)
- [ ] Refund orchestrator with 4-eye approval for >$5,000
- [ ] Stripe Issuing: virtual cards for Odyssey members
- [ ] Stripe Tax: automatic tax calculation by country

### 2.7 Notification Service (`notification-svc`)
- [ ] Email via SendGrid (transactional templates)
- [ ] Push via Firebase Cloud Messaging (iOS + Android)
- [ ] SMS via Twilio
- [ ] WhatsApp via Twilio or Meta Cloud API
- [ ] In-app notification storage + websocket delivery
- [ ] Template engine (Handlebars)
- [ ] Notification preferences respect per user
- [ ] Unsubscribe handling + bounce tracking

### 2.8 Concierge Service (`concierge-svc`)
- [ ] Ticket creation (`concierge_requests` table)
- [ ] SLA timer per tier: Odyssey < 30min, Atlas < 4hr, Voyager < 24hr
- [ ] Ticket ranking queue: Odyssey > Atlas > Voyager
- [ ] AI triage: auto-categorize + suggest resolution (LLM call)
- [ ] Human assignment (admin panel → concierge agent)
- [ ] Escalate-to-human endpoint (Odyssey: instant, others: queued)
- [ ] Resolution + feedback loop
- [ ] WebSocket for real-time status updates to user

### 2.9 Disruption Service (`disruption-svc`)
- [ ] FlightAware webhook ingestion (flight status changes)
- [ ] Disruption event creation (`disruption_events` table)
- [ ] Affected booking lookup (by flight number + date)
- [ ] AI rebook suggestions (Odin agent call)
- [ ] Proactive notification to user before wake-up
- [ ] Alternative offer presentation (UI + push)
- [ ] Manual rebook by concierge (admin Disruption Center)
- [ ] Hotel walk detection (Expedia Rapid webhook)
- [ ] Compensation offer generation (points, credits, upgrades)

### 2.10 Loyalty Service (`loyalty-svc`)
- [ ] Point accumulation on booking confirmed (event-driven)
- [ ] Point deduction on cancellation (compensating transaction)
- [ ] Referral code generation + redemption
- [ ] Friendbuy integration for referral tracking ($250 credit per Odyssey signup)
- [ ] Daily tier evaluation cron (Voyager → Atlas auto-upgrade thresholds)
- [ ] Point expiry (18-month rolling window)
- [ ] Plaid loyalty link (read hotel + airline loyalty balances)
- [ ] Loyalty dashboard API

### 2.11 Supplier Service (`supplier-svc`)
- [ ] Supplier registry (CRUD + API credentials storage, encrypted)
- [ ] Adapter pattern: `IBookingAdapter` interface
- [ ] Inventory cache (`inventory_cache` table, TTL-based invalidation)
- [ ] Bulk supplier onboarding (CSV import + KYC document upload)
- [ ] Rate card management
- [ ] Contract storage (PDF in S3)
- [ ] Health check per supplier adapter

### 2.12 Corporate Service (`corporate-svc`)
- [ ] Organization CRUD (`organizations` + `org_members` tables)
- [ ] Travel policy engine: max fare class, max hotel nightly rate, advance booking window, blackout dates
- [ ] Approval workflow: manager approval for out-of-policy bookings
- [ ] GST invoice generation (PDF + S3 storage)
- [ ] Expense claim submission + approval
- [ ] Expense export CSV/XLSX
- [ ] Slack app: trip notifications, approval requests, expense summaries

### 2.13 Analytics Service (`analytics-svc`)
- [ ] Segment.io server-side event tracking (identify, track, page)
- [ ] Snowflake sink (Segment → Snowflake via connector)
- [ ] dbt transformations (booking funnel, cohort retention, LTV)
- [ ] Looker embedded dashboards (iframes in admin)
- [ ] Custom event: search → view → hold → pay → confirm funnel
- [ ] A/B experiment framework (Optimizely or GrowthBook)

### 2.14 Content Service (`content-svc`)
- [ ] Destination pages CMS (headless, API-first)
- [ ] Sunday Inspiration article management
- [ ] Hotel listings (aeronix holidays editorial picks)
- [ ] Trip journals (user-generated, moderation queue)
- [ ] Review moderation (auto-flag with NLP)
- [ ] SEO metadata management per content piece

### 2.15 Fraud Service (`fraud-svc`)
- [ ] Risk score on booking create (velocity check, device fingerprint)
- [ ] KYC trigger for high-value bookings (>$5,000): Onfido / Persona
- [ ] Dispute management (chargebacks)
- [ ] IP reputation check (MaxMind)
- [ ] Card BIN country mismatch alert
- [ ] Automated block + manual review queue

---

## PHASE 3 — Odin AI Agent
> Target: Day 7–21 | App: `apps/agent-runtime/`

### 3.1 Agent Framework
- [ ] Python 3.12 + FastAPI project setup
- [ ] LangGraph state machine with planning + execution nodes
- [ ] CrewAI crew definitions (PlannerAgent, SearchAgent, BookingAgent, ConciergeAgent)
- [ ] Anthropic Claude 3.7 Sonnet as primary model
- [ ] OpenAI GPT-4o as fallback (circuit breaker pattern)
- [ ] Streaming responses via SSE (Server-Sent Events)
- [ ] Thread management: `POST /v1/agent/threads`, `POST /threads/:id/messages`

### 3.2 Memory System
- [ ] Short-term: Redis conversation history (last 20 turns per thread)
- [ ] Long-term: pgvector embeddings of past trips + reviews + DNA profile
- [ ] Episodic: last N significant events (disruptions, upgrades, compliments)
- [ ] Retrieval-Augmented Generation: similarity search on DNA + past bookings before each response

### 3.3 MCP Tool Definitions (`packages/agent-tools/`)
- [ ] `search.flights(origin, destination, date, cabin, passengers)`
- [ ] `search.hotels(destination, checkin, checkout, guests, stars)`
- [ ] `search.experiences(destination, date, category, group_size)`
- [ ] `search.transfers(pickup, dropoff, datetime, vehicle_type)`
- [ ] `price.lock(offer_id, user_id, ttl_hours)` — Hopper-style
- [ ] `price.predict(route, date)` → "buy now" | "wait" + confidence
- [ ] `booking.create(itinerary_id, segments, payment_method_id)`
- [ ] `booking.modify(booking_id, changes)`
- [ ] `booking.cancel(booking_id, reason)`
- [ ] `booking.rebook(booking_id, disruption_event_id)`
- [ ] `payment.charge(booking_id, amount, idempotency_key)`
- [ ] `payment.refund(booking_id, amount, reason)`
- [ ] `concierge.escalate(thread_id, reason, tier)`
- [ ] `calendar.read(user_id, provider)` → Google/Microsoft OAuth
- [ ] `email.summarize_inbox(user_id)` → travel-relevant emails
- [ ] `wallet.add_pass(booking_id, platform)` → Apple/Google Wallet
- [ ] `maps.route(from, to, mode)` — Mapbox
- [ ] `maps.place_details(place_id)` — Mapbox
- [ ] `weather.forecast(location, date)` — OpenWeatherMap
- [ ] `visa.requirements(passport_country, destination)` — Sherpa API
- [ ] `carbon.calculate_offset(segments)` — emissions calculation
- [ ] `review.summarize(property_id)` — sentiment + key themes

### 3.4 Guardrails
- [ ] Spend cap per tier: Voyager $500, Atlas $5,000, Odyssey unlimited → requires confirmation above threshold
- [ ] No cross-member data access
- [ ] Cite sources for factual claims (supplier data, visa rules)
- [ ] Human handoff trigger: ambiguity score > 0.7 → offer concierge
- [ ] Hallucination guard: only quote prices from live search results
- [ ] Input sanitization (prompt injection prevention)

### 3.5 Voice Interface
- [ ] OpenAI Realtime API integration for voice-to-voice
- [ ] WebRTC endpoint in FastAPI for mobile audio stream
- [ ] Transcript storage per thread
- [ ] Voice activity detection (VAD)
- [ ] Push-to-talk mode for noisy environments

### 3.6 Agent Evals
- [ ] 200-trip golden evaluation set covering:
  - Simple roundtrip (NYC → London)
  - Multi-city (NY → Paris → Rome → home)
  - Family with kids (dietary, activity preferences)
  - Wellness retreat (spa, detox tags)
  - Group co-planning (5 members, voting)
  - Disruption rebook (flight canceled morning of)
  - Visa rejection re-route (denied country → alternative)
- [ ] A/B vs. baseline GPT-4 with tools
- [ ] Automated eval runner (pytest + LLM-as-judge)
- [ ] Target: >80% task completion, >50% AI containment

---

## PHASE 4 — Admin Panel
> Target: Day 14–28 | App: `apps/admin/`

### 4.1 Admin App Setup
- [ ] Next.js 15 app with NextAuth (Google + Okta SAML)
- [ ] CASL RBAC: roles — superadmin, admin, concierge, support, finance, content, compliance
- [ ] Admin sidebar navigation (full list from §6.8)
- [ ] TanStack Table + shadcn DataTable for all list views
- [ ] Dark mode default (long shift comfort)

### 4.2 Dashboard
- [ ] GMV today (hourly chart)
- [ ] Active bookings (live)
- [ ] Refund requests in queue
- [ ] Concierge SLA breaches
- [ ] AI containment rate (Odin resolved / total requests)
- [ ] NPS rolling 30-day
- [ ] Revenue by tier (Voyager / Atlas / Odyssey)

### 4.3 Members Management
- [ ] All members table (search, filter by tier, status)
- [ ] Atlas/Odyssey members tab with perks tracking
- [ ] Household view (primary + family members)
- [ ] Member detail: profile, travel DNA, bookings, loyalty balance, concierge history
- [ ] Manual tier adjustment (with reason log)
- [ ] Impersonate member (superadmin only, audit logged)

### 4.4 Bookings Management
- [ ] Live bookings table (filter by status, date, tier, supplier)
- [ ] Booking detail: segments, payments, refund history, audit trail
- [ ] Manual status override (with reason)
- [ ] Initiate refund (< $5,000 single approval, ≥ $5,000 4-eye)
- [ ] Disputed bookings tab (chargeback tracking)
- [ ] Export bookings CSV/XLSX

### 4.5 Concierge Queue
- [ ] SLA-ranked ticket queue (Odyssey > Atlas > Voyager)
- [ ] Real-time WebSocket updates
- [ ] Assign ticket to concierge agent
- [ ] Thread view (user ↔ agent messages)
- [ ] Canned responses library
- [ ] SLA timer display (green → yellow → red)
- [ ] Escalation to supervisor
- [ ] Resolution + internal notes

### 4.6 Disruption Center
- [ ] Live FlightAware feed (flight status map)
- [ ] Affected bookings auto-surfaced
- [ ] AI rebook suggestions panel (Odin output)
- [ ] Accept suggestion → trigger rebook saga
- [ ] Manual override alternative
- [ ] Bulk rebook for same-flight multi-member disruptions

### 4.7 Suppliers
- [ ] Supplier CRUD (hotels, NDC airlines, experiences, transfers)
- [ ] Onboarding flow: contact, contract upload, API credential entry, test call
- [ ] Bulk CSV import with validation
- [ ] Health status per supplier (last successful call, error rate)
- [ ] Rate card management
- [ ] KYC document storage

### 4.8 Finance
- [ ] Refund approval queue (4-eye workflow for > $5,000)
- [ ] Settlement reconciliation (Stripe Payouts vs. booking revenue)
- [ ] Cohort revenue chart (weekly/monthly)
- [ ] Chargeback tracker
- [ ] Revenue by tier + vertical
- [ ] Export to accountant CSV

### 4.9 Content Management
- [ ] Inspiration articles (WYSIWYG editor, schedule publish)
- [ ] Destination page editor (SEO fields, hero image, content blocks)
- [ ] Hotel listings moderation
- [ ] User journal moderation queue (approve / reject / flag)
- [ ] Review moderation (auto-flagged NLP → manual review)

### 4.10 Loyalty Admin
- [ ] Loyalty point manual adjustments (with reason)
- [ ] Referral code lookup + usage stats
- [ ] Tier override tool
- [ ] Expiring points report

### 4.11 Compliance
- [ ] KYC queue (Onfido cases: pending, approved, rejected)
- [ ] GDPR DSAR requests (30-day SLA tracker)
- [ ] DPDP (India) consent log viewer
- [ ] Audit logs (searchable, filterable by actor, action, entity)
- [ ] Data retention policy enforcement (auto-delete per schedule)

### 4.12 Fraud & Security
- [ ] Risk score distribution chart
- [ ] High-risk booking review queue
- [ ] IP block list management
- [ ] Chargeback rate by user segment
- [ ] Manual KYC trigger tool

---

## PHASE 5 — Mobile App
> Target: Day 21–45 | App: `apps/mobile/`

### 5.1 App Setup
- [ ] Expo SDK 52 + React Native 0.79 project
- [ ] tamagui component library setup
- [ ] Expo Router for navigation
- [ ] Tab bar: Discover, Plan, Trips, Concierge, Profile
- [ ] Mapbox GL with premium styling

### 5.2 Auth
- [ ] Biometric login (FaceID / TouchID)
- [ ] Passkey support (platform authenticator)
- [ ] OTP + OAuth (Google / Apple Sign-In)
- [ ] Secure token storage (Expo SecureStore)

### 5.3 Discover Tab
- [ ] Sunday Inspiration editorial feed
- [ ] Set-jet trend feed (curated by concierge team)
- [ ] Wellness travel feed
- [ ] Creator reels integration
- [ ] Pull-to-refresh

### 5.4 Plan Tab (Odin)
- [ ] Odin chat interface (text input)
- [ ] Voice input (OpenAI Realtime API via WebRTC)
- [ ] Camera input (paste screenshot → extract travel intent)
- [ ] Itinerary canvas view (day-by-day, draggable)
- [ ] In-chat booking cards (book directly from chat)

### 5.5 Trips Tab
- [ ] Upcoming + past trips timeline
- [ ] Trip day cards (date, segments, weather)
- [ ] Offline e-tickets (cached in Expo FileSystem)
- [ ] Apple Wallet boarding pass integration
- [ ] Google Wallet pass integration
- [ ] Live disruption banner (flight status via push)
- [ ] Share itinerary button

### 5.6 Concierge Tab
- [ ] Chat with concierge (persistent presence)
- [ ] Escalate-to-human CTA (Odyssey: immediate)
- [ ] Ticket status tracker
- [ ] WhatsApp deep-link option

### 5.7 Profile Tab
- [ ] Membership tier display + upgrade CTA
- [ ] Travel DNA summary + edit
- [ ] Loyalty points balance
- [ ] Referral code share
- [ ] Settings (notifications, privacy)

### 5.8 Offline Mode
- [ ] Service worker caching of trip data
- [ ] SQLite (expo-sqlite) for offline trip storage
- [ ] Offline e-tickets (PDF cached)
- [ ] Offline maps (Mapbox downloaded tiles for destination)
- [ ] Sync on reconnect

### 5.9 Push Notifications
- [ ] Firebase Cloud Messaging (FCM) setup
- [ ] Notification handlers: booking confirmed, disruption, concierge message, price drop, Inspiration drop
- [ ] Rich push with image support
- [ ] Deep link from notification to relevant screen

---

## PHASE 6 — Growth Stack
> Target: Day 21–60 | Parallel with Phase 5

### 6.1 Analytics Foundation
- [ ] Segment.io SDK in web + mobile
- [ ] Server-side event tracking for booking funnel
- [ ] Snowflake connector setup
- [ ] dbt models: daily_active_users, booking_funnel, cohort_ltv
- [ ] Looker dashboards embedded in admin

### 6.2 Lifecycle Emails (Customer.io)
- [ ] W0: Onboarding DNA quiz reminder (if not completed)
- [ ] W1: First Inspiration drop (personalized by DNA)
- [ ] W2: Atlas trial offer
- [ ] W4: Referral nudge
- [ ] Anniversary trip prompt (12-month trigger)
- [ ] Disruption apology + perk (automatic on disruption event)
- [ ] Win-back: 60-day inactive → "We miss you" + $50 credit

### 6.3 Abandoned Recovery
- [ ] Abandoned search (intent detected, no booking): email at 2h + 24h
- [ ] Abandoned checkout (booking started, not completed): push at 30min + email at 2h
- [ ] Fare lock expiry reminder: push 1h before expiry
- [ ] Price drop alert: push when watched route drops > 5%

### 6.4 Referral Program
- [ ] Unique referral code per user (auto-generated on signup)
- [ ] Friendbuy integration for attribution tracking
- [ ] Reward: $250 Odin credits per Odyssey referral, $50 per Atlas
- [ ] Referral landing page + invite link
- [ ] Leaderboard (top referrers of the month)

### 6.5 SEO Content Engine
- [ ] 50 destination pages at launch
- [ ] Auto-generate price widgets from live search data
- [ ] Internal linking: search results → destination pages
- [ ] Monthly editorial: "aeronix holidays picks for [Season] [Year]"
- [ ] Programmatic pages: "Flights from [City] to [Destination]" (1,000+ pages)
- [ ] Backlink outreach: travel press (Skift, Phocuswire, Condé Nast)

### 6.6 Pricing Experiments
- [ ] A/B test Atlas price: $36/mo vs. $49/mo vs. $60/mo (Optimizely)
- [ ] Test Odyssey at $399/mo for early-bird cohort
- [ ] Measure: conversion, 90-day retention, LTV by price point
- [ ] Auto-rollout winner after statistical significance

### 6.7 B2B2C Partnership Pipeline
- [ ] HubSpot pipeline: private bank / wealth management partners
- [ ] Ten Lifestyle-style multi-year contract template
- [ ] Target: 1 regional private bank signed by Month 3
- [ ] Partner portal: white-label Odin + branded member benefits

---

## PHASE 7 — Supplier Integrations (Priority Order)
> Target: Day 7–60 (staggered)

### 7.1 Duffel (NDC Flights) — Week 1 sandbox, Week 2 production
- [ ] Duffel API client setup (sandbox)
- [ ] Offer request → offer listing → order creation
- [ ] Order management: get, cancel, change
- [ ] Seat maps + seat selection
- [ ] Baggage add-ons
- [ ] Refund via Duffel
- [ ] Production credential setup + go-live

### 7.2 Expedia Rapid (Hotels) — Week 1 sandbox, Week 2 production
- [ ] Expedia Rapid API client
- [ ] Property search + availability
- [ ] Room booking + confirmation
- [ ] Modify + cancel
- [ ] Property content sync (images, amenities, description)
- [ ] Rate shopping (multiple room types)

### 7.3 Viator + GetYourGuide (Experiences) — Month 2
- [ ] Viator API integration (search, book, cancel)
- [ ] GetYourGuide API integration
- [ ] Klook + Headout as backup adapters
- [ ] Experience detail pages
- [ ] Availability calendar

### 7.4 Blacklane (Transfers) — Month 2
- [ ] Blacklane API integration
- [ ] Quote + booking + cancel
- [ ] Meet-and-greet option
- [ ] Integration with itinerary planner (auto-suggest transfer on hotel check-in day)

### 7.5 FlightAware (Disruption Data) — Week 3
- [ ] FlightAware Firehose or alerts API
- [ ] Webhook handler in disruption-svc
- [ ] Alert mapping: delay, cancel, divert, gate change
- [ ] Affected booking lookup

### 7.6 Sherpa (Visa Requirements) — Month 2
- [ ] Sherpa API integration
- [ ] Visa requirements lookup by passport + destination
- [ ] Entry requirements display in itinerary planner
- [ ] Auto-warn when visa required with processing time

### 7.7 Boutique Hotels (Mr & Mrs Smith / Tablet) — Month 2–3
- [ ] MOU / API access negotiation
- [ ] Integration once signed
- [ ] Premium property badge in search results
- [ ] Atlas/Odyssey perks overlay (room upgrade, credit)

### 7.8 Amadeus/Sabre (GDS Fallback) — Month 3
- [ ] Amadeus Shopping API as fallback for Duffel gaps
- [ ] Sabre NDC for enterprise corporate routes
- [ ] GDS to canonical booking adapter

---

## PHASE 8 — Observability, Security & Compliance
> Target: Ongoing from Day 1

### 8.1 Observability
- [ ] Datadog APM agent on all services
- [ ] OpenTelemetry traces (distributed tracing)
- [ ] Custom dashboards: booking funnel, AI agent latency, supplier error rates
- [ ] Alerts: P99 latency > 2s, error rate > 1%, booking saga failures
- [ ] Sentry for frontend + backend error tracking
- [ ] Honeycomb for query analysis on complex traces
- [ ] Log aggregation (Datadog Logs)
- [ ] Synthetic monitoring (Datadog) for critical user flows

### 8.2 Security
- [ ] WAF rules (CloudFront + AWS Shield Standard)
- [ ] PCI DSS scope mapping (card data never touches aeronix servers)
- [ ] HTTPS everywhere (TLS 1.3 minimum)
- [ ] Secret management (AWS Secrets Manager)
- [ ] Dependency vulnerability scanning (Snyk in CI)
- [ ] SAST scanning (CodeQL in GitHub Actions)
- [ ] Penetration test (before beta launch)
- [ ] Bug bounty program setup (HackerOne)

### 8.3 Privacy & Compliance
- [ ] GDPR DPIA (Data Protection Impact Assessment)
- [ ] Cookie consent banner (Cookiebot or Osano)
- [ ] DPDP India compliance (consent log, grievance officer appointment)
- [ ] Travel agent licensing research per market (USA SOT, UK ATOL, India IATA)
- [ ] SOC 2 Type II readiness (Month 3)
- [ ] Data retention policy (auto-delete inactive accounts after 3 years)
- [ ] KYC SLA: Odyssey members KYC'd within 24h of signup

### 8.4 KYC
- [ ] Onfido integration for ID verification
- [ ] Persona as fallback
- [ ] DigiLocker for India (Aadhaar-linked KYC)
- [ ] Trigger rules: Odyssey members always, bookings > $5,000

---

## PHASE 9 — Series A Readiness
> Target: Month 3

### 9.1 Business Metrics
- [ ] 200 paid members (50 Atlas, 5 Odyssey) — private beta exit criteria
- [ ] $25K MRR
- [ ] NPS > 50
- [ ] AI containment > 50% (Odin resolves without human)
- [ ] 1,000 total bookings
- [ ] Zero P0 security incidents

### 9.2 Investor Materials
- [ ] Series A pitch deck (product, market, traction, team, financials)
- [ ] Financial model (3-year P&L, unit economics by tier)
- [ ] Data room: schema diagram, architecture diagram, security audit report
- [ ] Customer testimonials (Odyssey members)
- [ ] Press coverage (Skift, Phocuswire, Condé Nast Traveler)
- [ ] LOIs from suppliers (2 NDC airlines + 1 boutique hotel network + 1 private bank)

### 9.3 Team Hiring
- [ ] Head of AI (LangGraph + evals expertise)
- [ ] Head of Supply (ex-Booking/Expedia/Mr & Mrs Smith)
- [ ] Head of Concierge (ex-Knightsbridge/Abercrombie & Kent)
- [ ] 8 Full-stack engineers (TypeScript + Go)
- [ ] 2 ML engineers
- [ ] 2 SRE engineers
- [ ] 1 Product designer
- [ ] 4 Trip designers (Odyssey concierge team)
- [ ] 2 Disruption pod agents (24/7 coverage)

---

## SQL Schema Reference (PostgreSQL 16 + pgvector — complete)

```sql
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email CITEXT UNIQUE NOT NULL, phone_e164 TEXT UNIQUE, full_name TEXT, locale TEXT DEFAULT 'en-US', passport_country CHAR(2), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), deleted_at TIMESTAMPTZ);
CREATE TABLE profiles (user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, date_of_birth DATE, gender TEXT, dietary TEXT[], mobility TEXT, passports JSONB, loyalty_links JSONB);
CREATE TABLE travel_dna (user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, cabin_pref TEXT, hotel_star_min SMALLINT, vibe_tags TEXT[], budget_band_usd NUMRANGE, family_unit JSONB, sustainability_w REAL, embedding vector(1536), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE households (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), primary_user UUID REFERENCES users(id), members UUID[]);
CREATE TYPE membership_tier AS ENUM ('voyager','atlas','odyssey');
CREATE TABLE memberships (user_id UUID PRIMARY KEY REFERENCES users(id), tier membership_tier NOT NULL DEFAULT 'voyager', started_at TIMESTAMPTZ DEFAULT NOW(), renews_at TIMESTAMPTZ);
CREATE TABLE subscriptions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), tier membership_tier NOT NULL, status TEXT NOT NULL, stripe_sub_id TEXT, price_usd_cents BIGINT NOT NULL, current_period_end TIMESTAMPTZ);
CREATE TABLE loyalty_points (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id), delta BIGINT NOT NULL, reason TEXT NOT NULL, ref_id UUID, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE referrals (code TEXT PRIMARY KEY, referrer UUID REFERENCES users(id), referred UUID REFERENCES users(id), status TEXT, reward_usd_cents BIGINT);
CREATE TABLE suppliers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), type TEXT, name TEXT, rating_band TEXT, api_creds JSONB, contract JSONB);
CREATE TABLE inventory_cache (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), supplier_id UUID REFERENCES suppliers(id), product_key TEXT, payload JSONB, fetched_at TIMESTAMPTZ, expires_at TIMESTAMPTZ, UNIQUE(supplier_id, product_key));
CREATE TYPE booking_status AS ENUM ('held','confirmed','partially_canceled','canceled','completed','disputed');
CREATE TABLE itineraries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), title TEXT, starts_on DATE, ends_on DATE, total_usd NUMERIC(12,2), share_token TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), itinerary_id UUID REFERENCES itineraries(id), user_id UUID REFERENCES users(id), status booking_status DEFAULT 'held', total_usd NUMERIC(12,2), ancillaries JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE booking_segments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE, supplier_id UUID REFERENCES suppliers(id), segment_type TEXT, start_at TIMESTAMPTZ, end_at TIMESTAMPTZ, payload JSONB, status booking_status);
CREATE TABLE payment_methods (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), psp TEXT, token TEXT, brand TEXT, last4 CHAR(4), is_default BOOLEAN DEFAULT FALSE);
CREATE TABLE payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id), user_id UUID REFERENCES users(id), amount_usd NUMERIC(12,2), currency CHAR(3), psp TEXT, psp_intent_id TEXT, status TEXT, captured_at TIMESTAMPTZ, refunded_amount NUMERIC(12,2) DEFAULT 0);
CREATE TABLE concierge_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), channel TEXT, tier membership_tier, category TEXT, state TEXT, ai_summary TEXT, assigned_to UUID, created_at TIMESTAMPTZ DEFAULT NOW(), resolved_at TIMESTAMPTZ);
CREATE TABLE disruption_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id), detected_at TIMESTAMPTZ, type TEXT, payload JSONB, resolution TEXT);
CREATE TABLE reviews (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), segment_id UUID REFERENCES booking_segments(id), rating SMALLINT, body TEXT, photos TEXT[], created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE journals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), itinerary_id UUID REFERENCES itineraries(id), title TEXT, body_md TEXT, is_public BOOLEAN DEFAULT FALSE);
CREATE TABLE notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), channel TEXT, template TEXT, payload JSONB, sent_at TIMESTAMPTZ);
CREATE TABLE audit_logs (id BIGSERIAL PRIMARY KEY, actor UUID, action TEXT, target TEXT, meta JSONB, ip INET, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE consent_log (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id), scope TEXT, granted BOOLEAN NOT NULL, granted_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE organizations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, gstin TEXT, status TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE org_members (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id), user_id UUID REFERENCES users(id), role TEXT);
CREATE TABLE corporate_policies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id), name TEXT, rules_json JSONB, active BOOLEAN DEFAULT TRUE);
CREATE TABLE expense_claims (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id), user_id UUID REFERENCES users(id), booking_id UUID REFERENCES bookings(id), amount NUMERIC(12,2), status TEXT);
CREATE TABLE group_trips (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), creator_id UUID REFERENCES users(id), name TEXT, invite_code TEXT UNIQUE, destination TEXT, start_date DATE, end_date DATE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE group_members (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), group_id UUID REFERENCES group_trips(id), user_id UUID REFERENCES users(id), role TEXT DEFAULT 'member');
CREATE TABLE fare_locks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), offer_token TEXT, price_usd NUMERIC(12,2), expires_at TIMESTAMPTZ, is_converted BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE price_alerts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), origin CHAR(3), destination CHAR(3), target_price NUMERIC(12,2), current_price NUMERIC(12,2), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
```

---

## Complete API Route Map

```
Auth:          POST /v1/auth/otp/{request,verify}
               POST /v1/auth/oauth/:provider/callback
               POST /v1/auth/passkey/{register,authenticate}
               POST /v1/auth/logout
Profile/DNA:   GET/PATCH /v1/me | GET/PATCH /v1/me/dna
               POST/DELETE /v1/me/passports/:id | GET/POST /v1/me/loyalty-links
Subscriptions: GET /v1/subscriptions/plans
               POST/PATCH/DELETE /v1/subscriptions[/:id]
               POST /v1/subscriptions/portal
Search:        GET /v1/search/{flights,hotels,experiences,transfers,packages}
Pricing:       POST /v1/fare-locks | DELETE /v1/fare-locks/:id
               GET /v1/price-predict | GET/POST /v1/price-alerts
Agent:         POST /v1/agent/threads
               POST /v1/agent/threads/:id/messages
               GET /v1/agent/threads/:id
               POST /v1/agent/threads/:id/voice
Itineraries:   POST/GET/PATCH/DELETE /v1/itineraries[/:id]
               POST /v1/itineraries/:id/{share,duplicate}
Bookings:      POST/GET /v1/bookings[/:id]
               POST /v1/bookings/:id/{confirm,cancel,modify,disruption-rebook}
Payments:      POST /v1/payments/intents | POST/GET/DELETE /v1/payments/methods[/:id]
               POST /v1/payments/refunds | POST /v1/payments/split-request
Concierge:     POST/GET /v1/concierge/requests[/:id]
               POST /v1/concierge/requests/:id/{escalate,resolve,message}
Loyalty:       GET /v1/loyalty | POST /v1/referrals/redeem | GET /v1/referrals/code
Groups:        POST/GET /v1/groups[/:id]
               POST /v1/groups/:id/{invite,vote,split}
Reviews:       POST /v1/reviews
Journals:      POST/GET/PATCH /v1/journals[/:id]
Corporate:     POST/GET/PATCH /v1/corp/orgs[/:id]
               POST/GET /v1/corp/orgs/:id/{policies,members,expense-claims}
               GET /v1/corp/orgs/:id/expense-export
Content:       GET /v1/destinations/:slug | GET /v1/content/inspiration
Admin:         GET/PATCH /v1/admin/users[/:id] | GET /v1/admin/bookings
               POST /v1/admin/refunds | POST /v1/admin/concierge/:id/assign
               POST /v1/admin/disruptions | POST /v1/admin/suppliers
               GET /v1/admin/audit-logs | POST /v1/admin/suppliers/bulk-import
               GET /v1/admin/finance/settlements | POST /v1/admin/loyalty/adjust
Webhooks:      POST /v1/webhooks/{stripe,razorpay,adyen,flightaware,onfido,friendbuy}
```

---

## Landing Page Copy

**Hero:** "Your private travel firm. In your pocket. aeronix holidays pairs an autonomous AI travel agent with a human concierge desk — for the curious affluent who'd rather live the trip than plan it." [Begin your travel DNA →]

**Value prop trio:**
1. "Plan in minutes, not weeks." Odin builds a multi-modal itinerary — flight, train, ferry, transfer, restaurant — from one sentence.
2. "Sleep through disruption." Cancellations? We rebook before you wake up. Hotel walks you? We escalate.
3. "A team of curators on retainer." Odyssey members get a named Trip Designer who knows your kids' allergies, your wine, your sleep schedule.

**Membership ladder:** Voyager (Free) / Atlas ($480/yr) / Odyssey ($4,800/yr). As featured in: Skift, Phocuswire, Condé Nast Traveler, FT.

---

## Pricing Page

**Voyager — Free:** Unlimited search with Odin (3 turns/day cap); standard booking; pay-as-you-go trip protection.

**Atlas — $480/yr ($49/mo) [most popular]:** Unlimited Odin AI; free CFAR on first 4 trips/yr; 1,500+ partner hotel perks (room upgrade, $100 credit, late checkout); priority chat; Sunday Inspiration; 0% FX on aeronix holidays virtual card; 2× referral credits.

**Odyssey — $4,800/yr:** All Atlas + named human Trip Designer + 24/7 disruption pod + unlimited DragonPass airport lounges (1 guest) + annual private-transfer credit ($300) + longevity-clinic discount network + Apple Vision Pro property previews + family travel-DNA up to 6 + all-loyalty dashboard via Plaid + aeronix holidays Card with 1.5% travel cashback.

---

## 30-Day MVP Roadmap

**W1:** Repo scaffold (Turborepo); AWS landing zone (Terraform); Auth0 OTP; Stripe billing prototype; Odin agent skeleton on LangGraph with mock search.flights and Expedia Rapid sandbox search.hotels; Postgres schema.

**W2:** Real flight search (Duffel + 1 NDC airline); real hotel search (Expedia Rapid); booking saga (held → confirmed) for hotels; Atlas paywall; Travel-DNA quiz; Sunday Inspiration content scaffolding.

**W3:** Booking sagas for flights; payments via Stripe; refund flow; concierge ticket queue (admin); notification-svc (email + push); iOS app MVP (Expo) Discover + Plan + Trips.

**W4:** Disruption webhook (FlightAware); proactive rebook; Odyssey tier launch with manual human concierge; referral system; audit logs; security pass (PCI scope mapping, GDPR DPIA); private beta with 200 members.

**Exit criteria:** 200 members, 50 paid Atlas, 5 Odyssey, 1,000 bookings, NPS >50, AI containment >50%, zero P0 security issues.

---

## 90-Day Scale Roadmap

**M1:** MVP launch (above).

**M2:** NDC airline #2 + #3 (Lufthansa Group, Air France); Mr-&-Mrs-Smith-style boutique-hotel collection MOU; Viator + GetYourGuide live; Apple Wallet pass shipping; Stripe Issuing virtual cards live for Odyssey; voice (OpenAI Realtime) in mobile; Spanish + French localization.

**M3:** aeronix holidays for Teams (corporate) beta with 5 design partners; Slack agent; expense reconciliation; Odyssey Family Plan up to 6; Plaid loyalty-link dashboard; first B2B2C bank pilot (regional private bank target); SOC 2 Type II readiness; Series A pitch ready.

---

## Series A Roadmap & Thresholds

- **May–Jun 2026:** Validate Odyssey willingness-to-pay — 30 in-depth interviews. Threshold: ≥40% pre-commit deposit at $4,800/yr.
- **By July 2026:** Sign 2 NDC airline LOIs + 1 boutique-hotel network LOI + 1 private-bank LOI. Threshold: 3/4 LOIs.
- **By Sept 2026:** Ship 30-day plan. Series A threshold: 200 paid + $25K MRR + NPS >50 + AI containment >50%.
- **By Dec 2026:** Raise $15–20M at $80–120M post. Benchmark: Mindtrip $7M seed, Layla €3M seed. Spotnana/Navan comps suggest 12–15× ARR for premium AI-travel.
- **By Mar 2027:** 5,000 Atlas + 200 Odyssey + 3 corporate design partners + 1 bank distribution live.

**Pivot thresholds:**
- Odyssey pre-commit <20%: pivot to Atlas-only flat product, fold concierge into Atlas + per-event fees.
- Supplier LOIs <2: become Spotnana-style infra layer for advisor networks (Fora-style).
- AI containment <40% by Day 90: invest in human concierge headcount; reposition as "premium concierge with AI co-pilot."
- Major OTA ships premium-subscription competitor: accelerate B2B2C bank distribution to lock in moats.

---

## Hire Plan (First 30)

Co-founders ×2 (CEO product/growth, CTO platform); Head of AI; Head of Supply (ex-Booking/ex-Expedia/ex-Mr & Mrs Smith); Head of Concierge (ex-Knightsbridge/ex-A&K); 8 FS engineers, 2 ML, 2 SRE, 1 design, 1 brand, 2 PMs, 4 trip designers, 2 disruption-pod agents (24/7). Series-A trigger: first compliance officer + first sales lead for B2B2C.

---

*This is the v1 enterprise plan — for post-Series A scale. Current execution target: PLAN_v2.md (bootstrap MVP, ~$14/month). Read PLAN_v2.md first every session.*
