-- Run this once in Supabase: SQL Editor > New query > paste > Run.
create table if not exists bookings (
  id text primary key,
  doctor_slug text not null,
  doctor_name text not null,
  date date not null,
  time text not null,
  patient_name text not null,
  phone text not null,
  email text,
  notes text,
  status text not null default 'pending_payment',
  payment_mode text not null default 'clinic',
  payment_status text not null default 'unpaid',
  amount integer not null default 0,
  order_id text,
  payment_id text,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Two confirmed bookings can never share the same doctor, date and time.
create unique index if not exists bookings_one_confirmed_slot
  on bookings (doctor_slug, date, time) where status = 'confirmed';
create index if not exists bookings_date_idx on bookings (date);
create index if not exists bookings_order_idx on bookings (order_id);

create table if not exists blocks (
  id bigint generated always as identity primary key,
  doctor_slug text not null,
  date date not null,
  time text,
  reason text,
  created_at timestamptz not null default now()
);

-- Only the server (service_role key) may read or write. Do not add public policies: it holds patient phone numbers.
alter table bookings enable row level security;
alter table blocks enable row level security;

-- Let the server key use the tables (harmless if already granted).
grant usage on schema public to service_role;
grant all on table bookings, blocks to service_role;
grant usage, select on all sequences in schema public to service_role;
