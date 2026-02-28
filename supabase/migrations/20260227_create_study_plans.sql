-- user_study_plans: um plano por usuário (target_date opcional)
create table if not exists user_study_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  target_date date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint uq_user_study_plans_user_id unique (user_id)
);

-- user_study_plan_themes: temas do plano, ordenados por position
create table if not exists user_study_plan_themes (
  id              uuid primary key default gen_random_uuid(),
  study_plan_id   uuid not null references user_study_plans(id) on delete cascade,
  theme_id        uuid not null references themes(id) on delete cascade,
  position       int not null default 0,
  created_at      timestamptz not null default now(),

  constraint uq_user_study_plan_themes_plan_theme unique (study_plan_id, theme_id)
);

-- RLS
alter table user_study_plans enable row level security;
alter table user_study_plan_themes enable row level security;

-- user_study_plans: usuário acessa apenas o próprio plano
create policy "Users can read own study plan"
  on user_study_plans for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own study plan"
  on user_study_plans for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own study plan"
  on user_study_plans for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own study plan"
  on user_study_plans for delete
  to authenticated
  using (auth.uid() = user_id);

-- user_study_plan_themes: via study_plan (policy indireta: só acessa temas do próprio plano)
create policy "Users can read own study plan themes"
  on user_study_plan_themes for select
  to authenticated
  using (
    exists (
      select 1 from user_study_plans p
      where p.id = study_plan_id and p.user_id = auth.uid()
    )
  );

create policy "Users can insert own study plan themes"
  on user_study_plan_themes for insert
  to authenticated
  with check (
    exists (
      select 1 from user_study_plans p
      where p.id = study_plan_id and p.user_id = auth.uid()
    )
  );

create policy "Users can delete own study plan themes"
  on user_study_plan_themes for delete
  to authenticated
  using (
    exists (
      select 1 from user_study_plans p
      where p.id = study_plan_id and p.user_id = auth.uid()
    )
  );

-- Índices
create index if not exists idx_user_study_plan_themes_study_plan_id
  on user_study_plan_themes (study_plan_id, position);
