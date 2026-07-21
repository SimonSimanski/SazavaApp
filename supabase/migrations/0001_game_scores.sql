-- Minihra "Chytej bobky" – vlastní žebříček oddělený od prdníku.
-- Spusť v Supabase SQL editoru (Dashboard -> SQL Editor -> New query).

create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  score integer not null default 0 check (score >= 0),
  created_at timestamptz not null default now()
);

-- Rychlé řazení podle skóre
create index if not exists game_scores_score_idx on public.game_scores (score desc);
create index if not exists game_scores_user_idx on public.game_scores (user_id);

alter table public.game_scores enable row level security;

-- Žebříček je veřejný (přihlášení hráči vidí všechna skóre)
drop policy if exists "game_scores_select_all" on public.game_scores;
create policy "game_scores_select_all"
  on public.game_scores
  for select
  using (true);

-- Hráč může vkládat jen vlastní skóre
drop policy if exists "game_scores_insert_own" on public.game_scores;
create policy "game_scores_insert_own"
  on public.game_scores
  for insert
  with check (auth.uid() = user_id);
