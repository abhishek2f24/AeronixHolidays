-- ============================================================
-- aeronix holidays — bootstrap schema (6 tables)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. User profiles (linked to Supabase auth.users)
create table if not exists public.profiles (
  id                     uuid references auth.users(id) on delete cascade primary key,
  full_name              text,
  phone                  text,
  tier                   text not null default 'voyager'
                         check (tier in ('voyager', 'atlas', 'odyssey')),
  razorpay_customer_id     text unique,
  razorpay_subscription_id text unique,
  subscription_status    text,
  travel_dna             jsonb not null default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Bookings
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  type          text not null check (type in ('flight', 'hotel', 'package', 'experience', 'transfer')),
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed', 'canceled', 'refunded', 'completed')),
  total_usd     numeric(10,2),
  currency      char(3) not null default 'USD',
  supplier      text,
  supplier_ref  text,
  details       jsonb not null default '{}',
  refund_amount numeric(10,2),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3. AI conversation threads
create table if not exists public.ai_threads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text,
  messages   jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Concierge / support requests
create table if not exists public.concierge_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  subject        text,
  message        text not null,
  tier           text,
  status         text not null default 'open'
                 check (status in ('open', 'in_progress', 'resolved')),
  internal_notes text,
  created_at     timestamptz not null default now()
);

-- 5. Fare locks (price holds)
create table if not exists public.fare_locks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  offer_token   text not null,
  price_usd     numeric(10,2),
  expires_at    timestamptz,
  is_converted  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- 6. Price alerts
create table if not exists public.price_alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  origin        char(3),
  destination   char(3),
  target_price  numeric(10,2),
  current_price numeric(10,2),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── Row Level Security ──
alter table public.profiles            enable row level security;
alter table public.bookings            enable row level security;
alter table public.ai_threads          enable row level security;
alter table public.concierge_requests  enable row level security;
alter table public.fare_locks          enable row level security;
alter table public.price_alerts        enable row level security;

-- Users see only their own data
create policy "own_profile"   on public.profiles           for all using (auth.uid() = id);
create policy "own_bookings"  on public.bookings            for all using (auth.uid() = user_id);
create policy "own_threads"   on public.ai_threads          for all using (auth.uid() = user_id);
create policy "own_requests"  on public.concierge_requests  for all using (auth.uid() = user_id);
create policy "own_locks"     on public.fare_locks          for all using (auth.uid() = user_id);
create policy "own_alerts"    on public.price_alerts        for all using (auth.uid() = user_id);

-- ── Indexes ──
create index if not exists bookings_user_id_idx      on public.bookings(user_id);
create index if not exists bookings_status_idx       on public.bookings(status);
create index if not exists ai_threads_user_id_idx    on public.ai_threads(user_id);
create index if not exists fare_locks_expires_at_idx on public.fare_locks(expires_at);
