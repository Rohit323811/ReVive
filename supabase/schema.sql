-- ReVive — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor (or `supabase db push`).
-- Safe to re-run: idempotent.

-- ── Revivals: one row per saved project ─────────────────────────────────────
create table if not exists public.revivals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  object_id   text not null,                -- curated id or "ai-<slug>"
  idea_id     text not null,
  title       text not null,
  emoji       text not null default '✨',
  waste_kg    numeric not null default 0,
  savings_usd numeric not null default 0,
  saved_at    timestamptz not null default now()
);

create index if not exists revivals_user_saved_idx
  on public.revivals (user_id, saved_at desc);

alter table public.revivals enable row level security;

drop policy if exists "Users can read own revivals" on public.revivals;
create policy "Users can read own revivals"
  on public.revivals for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own revivals" on public.revivals;
create policy "Users can insert own revivals"
  on public.revivals for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own revivals" on public.revivals;
create policy "Users can delete own revivals"
  on public.revivals for delete
  using (auth.uid() = user_id);

-- ── Profiles: convenience view of auth users for the app ────────────────────
-- (Supabase already manages auth.users; this table is optional app metadata.)
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);
