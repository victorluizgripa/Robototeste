-- general_summaries: cache de resumos gerados por IA, chave (theme_id, level)
create table if not exists general_summaries (
  id          uuid primary key default gen_random_uuid(),
  theme_id    uuid not null references themes(id) on delete cascade,
  level       text not null check (level in ('medio', 'tecnico', 'superior')),
  content_md  text not null,
  created_at  timestamptz not null default now(),

  constraint uq_general_summaries_theme_level unique (theme_id, level)
);

-- user_summaries: vínculo entre usuário e resumo geral (semântica de referência)
create table if not exists user_summaries (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  general_summary_id  uuid not null references general_summaries(id) on delete cascade,
  created_at          timestamptz not null default now(),

  constraint uq_user_summaries_user_general unique (user_id, general_summary_id)
);

-- RLS
alter table general_summaries enable row level security;
alter table user_summaries enable row level security;

-- general_summaries: leitura para autenticados, escrita via service role
create policy "Authenticated users can read general summaries"
  on general_summaries for select
  to authenticated
  using (true);

-- user_summaries: cada usuário acessa apenas os próprios
create policy "Users can read own summaries"
  on user_summaries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own summaries"
  on user_summaries for insert
  to authenticated
  with check (auth.uid() = user_id);

-- general_summaries: insert por autenticados (geração via server action)
create policy "Authenticated users can insert general summaries"
  on general_summaries for insert
  to authenticated
  with check (true);

-- Índices
create index if not exists idx_general_summaries_theme_level
  on general_summaries (theme_id, level);

create index if not exists idx_user_summaries_user_id
  on user_summaries (user_id, created_at desc);
