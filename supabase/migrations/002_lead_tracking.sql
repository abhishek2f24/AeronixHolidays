-- ============================================================
-- aeronix holidays — Lead Tracking & Affiliate Conversion
-- ============================================================

-- 7. Redirect logs (Tracking external partner clicks)
create table if not exists public.redirect_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  type          text not null check (type in ('flight', 'hotel', 'package')),
  partner_name  text not null,
  destination   text,
  url           text,
  created_at    timestamptz not null default now()
);

-- RLS
alter table public.redirect_logs enable row level security;

-- Admin can see all, users can see only theirs (or none if it's purely for analytics)
create policy "own_redirects" on public.redirect_logs for all using (auth.uid() = user_id);

-- Indexing for speed in admin dashboard
create index if not exists redirect_logs_type_idx on public.redirect_logs(type);
create index if not exists redirect_logs_partner_idx on public.redirect_logs(partner_name);
create index if not exists redirect_logs_created_at_idx on public.redirect_logs(created_at);
