-- New core table for travel packages
create table if not exists packages (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  destination  text not null,
  duration_days int not null,
  price_inr    numeric(12,2) not null,
  original_price_inr numeric(12,2),
  inclusions   text[],
  exclusions   text[],
  itinerary    jsonb,         -- [{day: 1, title: "...", activities: [...]}]
  images       text[],
  category     text,          -- honeymoon, family, adventure, corporate
  is_active    boolean default true,
  max_pax      int default 2,
  created_at   timestamptz default now()
);

-- Alter bookings table to support Razorpay one-time payments
alter table bookings add column if not exists razorpay_order_id text;
alter table bookings add column if not exists razorpay_payment_id text;
alter table bookings add column if not exists package_id uuid references packages(id);
alter table bookings add column if not exists amount_paid numeric(12,2);
alter table bookings add column if not exists traveler_details jsonb;
