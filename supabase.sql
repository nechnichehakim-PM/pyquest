-- ============================================================
-- PyQuest — schéma Supabase
-- À coller UNE FOIS dans : Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists public.profils (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text not null default 'Héros',
  xp int not null default 0,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profils enable row level security;

-- Tous les joueurs connectés voient le classement (pseudo + xp)
create policy "classement visible par les joueurs"
  on public.profils for select to authenticated using (true);

-- Chacun ne peut créer QUE son propre profil
create policy "creation de son profil"
  on public.profils for insert to authenticated with check (auth.uid() = id);

-- Chacun ne peut modifier QUE son propre profil
create policy "mise a jour de son profil"
  on public.profils for update to authenticated using (auth.uid() = id);
